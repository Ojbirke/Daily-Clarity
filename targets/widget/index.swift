import WidgetKit
import SwiftUI

// App Group shared with the main app (see app.json + expo-target.config.js).
let APP_GROUP = "group.com.dailyclarity.app"

struct ClarityEntry: TimelineEntry {
    let date: Date
    let choice: String
    let streak: Int
    let checkedIn: Bool
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> ClarityEntry {
        ClarityEntry(date: Date(), choice: "Focus", streak: 3, checkedIn: true)
    }

    func getSnapshot(in context: Context, completion: @escaping (ClarityEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<ClarityEntry>) -> Void) {
        let entry = loadEntry()
        // Refresh just after the next midnight so the "check in today" prompt
        // reappears on a new day even if the app hasn't been opened.
        let nextMidnight = Calendar.current.startOfDay(for: Date().addingTimeInterval(86_400))
        completion(Timeline(entries: [entry], policy: .after(nextMidnight)))
    }

    private func todayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        return formatter.string(from: Date())
    }

    private func loadEntry() -> ClarityEntry {
        let defaults = UserDefaults(suiteName: APP_GROUP)
        let storedDate = defaults?.string(forKey: "todayDate") ?? ""
        let choice = defaults?.string(forKey: "todayChoice") ?? ""
        let streak = defaults?.integer(forKey: "streak") ?? 0

        let checkedIn = (storedDate == todayString()) && !choice.isEmpty
        return ClarityEntry(date: Date(), choice: choice, streak: streak, checkedIn: checkedIn)
    }
}

struct DailyClarityWidgetView: View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            if entry.checkedIn {
                Text("TODAY'S INTENTION")
                    .font(.system(size: 11, weight: .medium))
                    .tracking(1)
                    .foregroundColor(.secondary)
                Text(entry.choice)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.primary)
                Spacer(minLength: 0)
                if entry.streak > 0 {
                    Text("🔥 \(entry.streak) day streak")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.secondary)
                }
            } else {
                Text("DAILY CLARITY")
                    .font(.system(size: 11, weight: .medium))
                    .tracking(1)
                    .foregroundColor(.secondary)
                Spacer(minLength: 0)
                Text("What matters most today?")
                    .font(.system(size: 19, weight: .bold))
                    .foregroundColor(.primary)
                Spacer(minLength: 0)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
        // Deep-link into the app so tapping the widget opens the check-in.
        .widgetURL(URL(string: "dailyclarity://"))
    }
}

@main
struct DailyClarityWidget: Widget {
    let kind: String = "DailyClarityWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                DailyClarityWidgetView(entry: entry)
                    .padding()
                    .containerBackground(.background, for: .widget)
            } else {
                DailyClarityWidgetView(entry: entry)
                    .padding()
            }
        }
        .configurationDisplayName("Daily Clarity")
        .description("Your intention for today.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}
