/** The `today` block of a real POST /run (Hamburg scenario), for the offline fallback.
 * Newer API responses carry `today` on every run and on /api/initial. */
export const recordedToday = {
 "at_stake": {
  "title": "At stake",
  "subtitle": "If nothing is done, against the recommended action",
  "rows": [
   {
    "id": "SHP-002",
    "customer": "Nordmed Pharma Logistik AG",
    "cargo": "Refrigerated pharma (reefer)",
    "decision": "hold",
    "headline": "No better option - hold and notify",
    "stay_exposure_eur": 91000,
    "action_exposure_eur": 91000,
    "avoided_eur": 0,
    "breaks_date": true,
    "costs_basis": "from the booking's commercial terms"
   },
   {
    "id": "SHP-001",
    "customer": "Bavaria Drivetrain GmbH",
    "cargo": "Automotive parts",
    "decision": "reroute",
    "headline": "Reroute via RTM - +2d, inside 4d slack",
    "stay_exposure_eur": 31500,
    "action_exposure_eur": 2304,
    "avoided_eur": 29196,
    "breaks_date": false,
    "costs_basis": "from the booking's commercial terms"
   },
   {
    "id": "SHP-005",
    "customer": "Elbe Werkzeugbau GmbH",
    "cargo": "Machinery",
    "decision": "reroute",
    "headline": "Reroute via RTM - +2d, inside 3d slack",
    "stay_exposure_eur": 18600,
    "action_exposure_eur": 1296,
    "avoided_eur": 17304,
    "breaks_date": false,
    "costs_basis": "from the booking's commercial terms"
   }
  ],
  "total_stay_eur": 141100,
  "total_action_eur": 94600,
  "total_avoided_eur": 46500,
  "basis": "Computed from each booking's commercial terms - freight, the cost of a day late, the cost of missing the date - by the Routing agent. Not a forecast, and not a market figure."
 },
 "customers": {
  "title": "Customers to notify",
  "subtitle": "Each customer a decision affects; the mail is drafted, not sent",
  "rows": [
   {
    "customer": "Nordmed Pharma Logistik AG",
    "bookings": [
     "SHP-002"
    ],
    "breaks_date": true,
    "drafts": 1
   },
   {
    "customer": "Bavaria Drivetrain GmbH",
    "bookings": [
     "SHP-001"
    ],
    "breaks_date": false,
    "drafts": 1
   },
   {
    "customer": "Elbe Werkzeugbau GmbH",
    "bookings": [
     "SHP-005"
    ],
    "breaks_date": false,
    "drafts": 1
   }
  ]
 },
 "runway": {
  "title": "Time runway",
  "subtitle": "Slack against the worst delay if nothing is done, and where the decision leaves it - what still breaks its date on top",
  "statuses": {
   "breaks": "misses the required-by date even after the decision",
   "resolved": "would have missed it; the decision keeps the date",
   "close": "on plan, but close to the limit",
   "clear": "time to spare"
  },
  "rows": [
   {
    "id": "SHP-002",
    "cargo": "Refrigerated pharma (reefer)",
    "customer": "Nordmed Pharma Logistik AG",
    "state": "hold",
    "decision": "hold",
    "slack_days": 1,
    "worst_delay_days": 5,
    "margin_days": -4,
    "delay_after_decision_days": 5,
    "margin_after_decision_days": -4,
    "severity": "high",
    "status": "breaks"
   },
   {
    "id": "SHP-005",
    "cargo": "Machinery",
    "customer": "Elbe Werkzeugbau GmbH",
    "state": "rerouted",
    "decision": "reroute",
    "slack_days": 3,
    "worst_delay_days": 5,
    "margin_days": -2,
    "delay_after_decision_days": 2,
    "margin_after_decision_days": 1,
    "severity": "high",
    "status": "resolved"
   },
   {
    "id": "SHP-001",
    "cargo": "Automotive parts",
    "customer": "Bavaria Drivetrain GmbH",
    "state": "rerouted",
    "decision": "reroute",
    "slack_days": 4,
    "worst_delay_days": 5,
    "margin_days": -1,
    "delay_after_decision_days": 2,
    "margin_after_decision_days": 2,
    "severity": "high",
    "status": "resolved"
   },
   {
    "id": "SHP-004",
    "cargo": "Electronics",
    "customer": "Kempen Electronics NV",
    "state": "green",
    "decision": "no-action",
    "slack_days": 2,
    "worst_delay_days": 0,
    "margin_days": 2,
    "delay_after_decision_days": 0,
    "margin_after_decision_days": 2,
    "severity": null,
    "status": "clear"
   },
   {
    "id": "SHP-003",
    "cargo": "Furniture",
    "customer": "Wonen Direct B.V.",
    "state": "green",
    "decision": "no-action",
    "slack_days": 3,
    "worst_delay_days": 0,
    "margin_days": 3,
    "delay_after_decision_days": 0,
    "margin_after_decision_days": 3,
    "severity": null,
    "status": "clear"
   },
   {
    "id": "SHP-006",
    "cargo": "Industrial chemicals",
    "customer": "Rheintal Spezialchemie AG",
    "state": "green",
    "decision": "no-action",
    "slack_days": 3,
    "worst_delay_days": 0,
    "margin_days": 3,
    "delay_after_decision_days": 0,
    "margin_after_decision_days": 3,
    "severity": null,
    "status": "clear"
   },
   {
    "id": "SHP-007",
    "cargo": "Textiles",
    "customer": "Maison Cardelle SAS",
    "state": "green",
    "decision": "no-action",
    "slack_days": 5,
    "worst_delay_days": 0,
    "margin_days": 5,
    "delay_after_decision_days": 0,
    "margin_after_decision_days": 5,
    "severity": null,
    "status": "clear"
   }
  ]
 },
 "watchlist": [],
 "journey": {
  "title": "Where every shipment is",
  "subtitle": "In its voyage, and in the agents' loop",
  "rows": [
   {
    "id": "SHP-001",
    "cargo": "Automotive parts",
    "customer": "Bavaria Drivetrain GmbH",
    "origin": "Shanghai",
    "destination": "Munich",
    "carrier": "Hapag-Lloyd",
    "state": "rerouted",
    "voyage": {
     "status": "at sea",
     "progress": 0.53,
     "etd": "2026-09-09",
     "eta": "2026-10-11",
     "revised_eta": "2026-10-13",
     "required_by": "2026-10-15",
     "days_to_eta": 17,
     "basis": "estimated from ETD and ETA - not vessel tracking"
    },
    "loop": [
     {
      "key": "detected",
      "label": "Disruption detected",
      "done": true,
      "detail": "Warning strike at Port of Hamburg - union calls full-day walkout"
     },
     {
      "key": "decided",
      "label": "Decision",
      "done": true,
      "detail": "Reroute via RTM - +2d, inside 4d slack"
     },
     {
      "key": "drafted",
      "label": "Mails drafted",
      "done": true,
      "detail": "2 drafts, not sent"
     },
     {
      "key": "queued",
      "label": "Queued to the TMS",
      "done": true,
      "detail": "4 changes, not written"
     },
     {
      "key": "approved",
      "label": "Your approval",
      "done": null,
      "detail": "recorded by the dashboard when you approve"
     }
    ]
   },
   {
    "id": "SHP-002",
    "cargo": "Refrigerated pharma (reefer)",
    "customer": "Nordmed Pharma Logistik AG",
    "origin": "Ningbo",
    "destination": "Hamburg",
    "carrier": "Maersk",
    "state": "hold",
    "voyage": {
     "status": "at sea",
     "progress": 0.44,
     "etd": "2026-09-12",
     "eta": "2026-10-14",
     "revised_eta": "2026-10-19",
     "required_by": "2026-10-15",
     "days_to_eta": 23,
     "basis": "estimated from ETD and ETA - not vessel tracking"
    },
    "loop": [
     {
      "key": "detected",
      "label": "Disruption detected",
      "done": true,
      "detail": "Warning strike at Port of Hamburg - union calls full-day walkout"
     },
     {
      "key": "decided",
      "label": "Decision",
      "done": true,
      "detail": "No better option - hold and notify"
     },
     {
      "key": "drafted",
      "label": "Mails drafted",
      "done": true,
      "detail": "2 drafts, not sent"
     },
     {
      "key": "queued",
      "label": "Queued to the TMS",
      "done": true,
      "detail": "4 changes, not written"
     },
     {
      "key": "approved",
      "label": "Your approval",
      "done": null,
      "detail": "recorded by the dashboard when you approve"
     }
    ]
   },
   {
    "id": "SHP-003",
    "cargo": "Furniture",
    "customer": "Wonen Direct B.V.",
    "origin": "Shanghai",
    "destination": "Rotterdam",
    "carrier": "CMA CGM",
    "state": "green",
    "voyage": {
     "status": "at sea",
     "progress": 0.45,
     "etd": "2026-09-11",
     "eta": "2026-10-14",
     "revised_eta": null,
     "required_by": "2026-10-17",
     "days_to_eta": 18,
     "basis": "estimated from ETD and ETA - not vessel tracking"
    },
    "loop": [
     {
      "key": "detected",
      "label": "Disruption detected",
      "done": false,
      "detail": "Nothing active on its route"
     },
     {
      "key": "decided",
      "label": "Decision",
      "done": false,
      "detail": "No active risk on this route"
     },
     {
      "key": "drafted",
      "label": "Mails drafted",
      "done": false,
      "detail": "Nothing to tell anyone"
     },
     {
      "key": "queued",
      "label": "Queued to the TMS",
      "done": false,
      "detail": "No change needed"
     },
     {
      "key": "approved",
      "label": "Your approval",
      "done": null,
      "detail": "recorded by the dashboard when you approve"
     }
    ]
   },
   {
    "id": "SHP-004",
    "cargo": "Electronics",
    "customer": "Kempen Electronics NV",
    "origin": "Shenzhen",
    "destination": "Antwerp",
    "carrier": "MSC",
    "state": "green",
    "voyage": {
     "status": "at sea",
     "progress": 0.39,
     "etd": "2026-09-13",
     "eta": "2026-10-16",
     "revised_eta": null,
     "required_by": "2026-10-18",
     "days_to_eta": 20,
     "basis": "estimated from ETD and ETA - not vessel tracking"
    },
    "loop": [
     {
      "key": "detected",
      "label": "Disruption detected",
      "done": false,
      "detail": "Nothing active on its route"
     },
     {
      "key": "decided",
      "label": "Decision",
      "done": false,
      "detail": "No active risk on this route"
     },
     {
      "key": "drafted",
      "label": "Mails drafted",
      "done": false,
      "detail": "Nothing to tell anyone"
     },
     {
      "key": "queued",
      "label": "Queued to the TMS",
      "done": false,
      "detail": "No change needed"
     },
     {
      "key": "approved",
      "label": "Your approval",
      "done": null,
      "detail": "recorded by the dashboard when you approve"
     }
    ]
   },
   {
    "id": "SHP-005",
    "cargo": "Machinery",
    "customer": "Elbe Werkzeugbau GmbH",
    "origin": "Busan",
    "destination": "Hamburg",
    "carrier": "Hapag-Lloyd",
    "state": "rerouted",
    "voyage": {
     "status": "at sea",
     "progress": 0.5,
     "etd": "2026-09-10",
     "eta": "2026-10-12",
     "revised_eta": "2026-10-14",
     "required_by": "2026-10-15",
     "days_to_eta": 18,
     "basis": "estimated from ETD and ETA - not vessel tracking"
    },
    "loop": [
     {
      "key": "detected",
      "label": "Disruption detected",
      "done": true,
      "detail": "Warning strike at Port of Hamburg - union calls full-day walkout"
     },
     {
      "key": "decided",
      "label": "Decision",
      "done": true,
      "detail": "Reroute via RTM - +2d, inside 3d slack"
     },
     {
      "key": "drafted",
      "label": "Mails drafted",
      "done": true,
      "detail": "2 drafts, not sent"
     },
     {
      "key": "queued",
      "label": "Queued to the TMS",
      "done": true,
      "detail": "4 changes, not written"
     },
     {
      "key": "approved",
      "label": "Your approval",
      "done": null,
      "detail": "recorded by the dashboard when you approve"
     }
    ]
   },
   {
    "id": "SHP-006",
    "cargo": "Industrial chemicals",
    "customer": "Rheintal Spezialchemie AG",
    "origin": "Shanghai",
    "destination": "Basel",
    "carrier": "CMA CGM",
    "state": "green",
    "voyage": {
     "status": "at sea",
     "progress": 0.5,
     "etd": "2026-09-07",
     "eta": "2026-10-15",
     "revised_eta": null,
     "required_by": "2026-10-18",
     "days_to_eta": 19,
     "basis": "estimated from ETD and ETA - not vessel tracking"
    },
    "loop": [
     {
      "key": "detected",
      "label": "Disruption detected",
      "done": false,
      "detail": "Nothing active on its route"
     },
     {
      "key": "decided",
      "label": "Decision",
      "done": false,
      "detail": "No active risk on this route"
     },
     {
      "key": "drafted",
      "label": "Mails drafted",
      "done": false,
      "detail": "Nothing to tell anyone"
     },
     {
      "key": "queued",
      "label": "Queued to the TMS",
      "done": false,
      "detail": "No change needed"
     },
     {
      "key": "approved",
      "label": "Your approval",
      "done": null,
      "detail": "recorded by the dashboard when you approve"
     }
    ]
   },
   {
    "id": "SHP-007",
    "cargo": "Textiles",
    "customer": "Maison Cardelle SAS",
    "origin": "Shanghai",
    "destination": "Lyon",
    "carrier": "MSC",
    "state": "green",
    "voyage": {
     "status": "at sea",
     "progress": 0.35,
     "etd": "2026-09-15",
     "eta": "2026-10-16",
     "revised_eta": null,
     "required_by": "2026-10-21",
     "days_to_eta": 20,
     "basis": "estimated from ETD and ETA - not vessel tracking"
    },
    "loop": [
     {
      "key": "detected",
      "label": "Disruption detected",
      "done": false,
      "detail": "Nothing active on its route"
     },
     {
      "key": "decided",
      "label": "Decision",
      "done": false,
      "detail": "No active risk on this route"
     },
     {
      "key": "drafted",
      "label": "Mails drafted",
      "done": false,
      "detail": "Nothing to tell anyone"
     },
     {
      "key": "queued",
      "label": "Queued to the TMS",
      "done": false,
      "detail": "No change needed"
     },
     {
      "key": "approved",
      "label": "Your approval",
      "done": null,
      "detail": "recorded by the dashboard when you approve"
     }
    ]
   }
  ]
 },
 "scenario": "Hamburg port strike"
};
