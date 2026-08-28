package expo.modules.livetimer

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

private const val CHANNEL_ID = "session-reset-live-timer"

/**
 * Options for one live countdown notification.
 *
 * Times are epoch milliseconds, passed as Double because that is what crosses
 * the JS bridge losslessly for values of this size.
 */
class LiveTimerOptions : Record {
  @Field val id: String = ""
  @Field val title: String = ""
  @Field val body: String = ""
  @Field val endsAt: Double = 0.0
  @Field val color: String? = null
  @Field val channelName: String = "Active windows"
  @Field val channelDescription: String = ""
}

/**
 * A notification that counts itself down.
 *
 * `setUsesChronometer` + `setChronometerCountDown` hand the ticking to the
 * system: Android re-renders the remaining time every second whether or not
 * this app is running, which a scheduled one-shot notification cannot do and
 * JS timers certainly cannot do once the process is gone.
 *
 * Deliberately not a foreground service. The countdown is information, not
 * work — a service would demand a persistent-notification justification at
 * review and drain battery for something the system already redraws for free.
 */
class LiveTimerModule : Module() {
  private val context: Context
    get() = requireNotNull(appContext.reactContext) { "React context is unavailable" }

  override fun definition() = ModuleDefinition {
    Name("LiveTimer")

    Function("isAvailable") { true }

    Function("start") { options: LiveTimerOptions ->
      val manager = NotificationManagerCompat.from(context)
      // On API 33+ posting without POST_NOTIFICATIONS is a no-op anyway;
      // checking first keeps it an explicit decision rather than a silent one.
      if (!manager.areNotificationsEnabled()) return@Function

      ensureChannel(options)
      manager.notify(notificationId(options.id), buildNotification(options))
    }

    Function("stop") { id: String ->
      NotificationManagerCompat.from(context).cancel(notificationId(id))
    }

    Function("stopAll") {
      val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      // Only clear our own channel; expo-notifications owns the others.
      manager.activeNotifications
        .filter { it.notification.channelId == CHANNEL_ID }
        .forEach { manager.cancel(it.id) }
    }
  }

  /**
   * Stable per-timer id so re-posting the same timer updates its notification
   * in place rather than stacking duplicates.
   */
  private fun notificationId(id: String): Int = id.hashCode()

  private fun ensureChannel(options: LiveTimerOptions) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    // IMPORTANCE_LOW: visible and persistent, but never makes a sound or peeks
    // as a heads-up. The alarms are separate notifications; this one is a
    // status readout the user chose to have on screen.
    val channel = NotificationChannel(
      CHANNEL_ID,
      options.channelName,
      NotificationManager.IMPORTANCE_LOW
    ).apply {
      description = options.channelDescription
      setShowBadge(false)
      enableVibration(false)
      setSound(null, null)
      // On O+ the channel decides what the lock screen may show, and it
      // overrides the per-notification visibility. Without this the countdown
      // can be hidden behind "contents hidden" on the lock screen, which is
      // the one place it most needs to be readable.
      lockscreenVisibility = Notification.VISIBILITY_PUBLIC
    }
    manager.createNotificationChannel(channel)
  }

  private fun buildNotification(options: LiveTimerOptions): Notification {
    val endsAt = options.endsAt.toLong()

    val builder = NotificationCompat.Builder(context, CHANNEL_ID)
      .setSmallIcon(smallIconRes())
      .setContentTitle(options.title)
      .setContentText(options.body)
      .setOngoing(true)
      // Re-posting (relaunch, language change) must not re-alert.
      .setOnlyAlertOnce(true)
      .setShowWhen(true)
      // `when` is the target; with countDown set the system renders the
      // remaining time and decrements it once a second on its own.
      .setWhen(endsAt)
      .setUsesChronometer(true)
      // No progress bar here on purpose. setProgress is evaluated once, at
      // post time, and nothing re-posts while the app is closed — so over a
      // five-hour window the bar would sit frozen near 0% beside a countdown
      // correctly reading two hours left. A stale bar next to live figures
      // undermines the figures; the countdown alone is honest.
      .setCategory(NotificationCompat.CATEGORY_STATUS)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setContentIntent(openTimerIntent(options.id))

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      builder.setChronometerCountDown(true)
    }

    // Tints the small icon and the app name in the shade with the service's
    // own brand colour, so Claude and Codex windows read apart at a glance.
    options.color?.let { hex ->
      runCatching { Color.parseColor(hex) }.getOrNull()?.let(builder::setColor)
    }

    return builder.build()
  }

  /**
   * Prefers the icon expo-notifications generates from app.json's
   * `notification.icon`; falls back to the launcher icon so the notification
   * can never fail to post for want of a drawable.
   */
  private fun smallIconRes(): Int {
    val generated = context.resources.getIdentifier(
      "notification_icon", "drawable", context.packageName
    )
    return if (generated != 0) generated else context.applicationInfo.icon
  }

  /** Tapping the notification opens that timer's full-screen view. */
  private fun openTimerIntent(id: String): PendingIntent {
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("sessionreset://timer/$id")).apply {
      setPackage(context.packageName)
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
    }

    var flags = PendingIntent.FLAG_UPDATE_CURRENT
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      flags = flags or PendingIntent.FLAG_IMMUTABLE
    }

    return PendingIntent.getActivity(context, notificationId(id), intent, flags)
  }
}
