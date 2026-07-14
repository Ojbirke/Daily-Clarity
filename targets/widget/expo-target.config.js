/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: "widget",
  name: "DailyClarityWidget",
  icon: "../../assets/images/icon.png",
  // Must match the App Group declared on the main app in app.json so the
  // widget can read the shared UserDefaults the app writes to.
  entitlements: {
    "com.apple.security.application-groups": ["group.com.dailyclarity.app"],
  },
};
