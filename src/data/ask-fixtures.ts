/**
 * Recorded answers from the SQRlane API, used only when https://www.sqrlane.com cannot be
 * reached - the same rule as the recorded run in fixtures.ts. Generated from a real run of
 * POST /api/ask (Hamburg strike scenario) and POST /api/tms/connect on the sample export.
 * Do not edit by hand: regenerate from the API.
 */
export const recordedAnswers = {
 "Where is SHP-002?": {
  "question": "Where is SHP-002?",
  "routed_to": {
   "id": "milestones",
   "name": "Milestones Worker",
   "mode": "live"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: where is",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "Where is SHP-002?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "Milestones Worker",
    "to_id": "milestones",
    "kind": "handoff",
    "text": "Where is SHP-002?",
    "why": "Routed by rules: strongest cues: where is."
   },
   {
    "seq": 3,
    "from": "Milestones Worker",
    "from_id": "milestones",
    "to": "TMS Link",
    "to_id": "tms",
    "kind": "query",
    "text": "Read SHP-002 from the book."
   },
   {
    "seq": 4,
    "from": "TMS Link",
    "from_id": "tms",
    "to": "Milestones Worker",
    "to_id": "milestones",
    "kind": "reply",
    "text": "SHP-002: Refrigerated pharma (reefer), Ningbo to Hamburg, Maersk MAEU-9930472. Booked ETA 2026-10-14, required by 2026-10-15 (1 day slack). Read from TMS (demo connector).",
    "why": "The booking's own record is the starting point: ETA and required-by are read, never assumed."
   },
   {
    "seq": 5,
    "from": "Milestones Worker",
    "from_id": "milestones",
    "to": "Routing Worker",
    "to_id": "routing",
    "kind": "query",
    "text": "Is SHP-002 on plan?"
   },
   {
    "seq": 6,
    "from": "Routing Worker",
    "from_id": "routing",
    "to": "Milestones Worker",
    "to_id": "milestones",
    "kind": "reply",
    "text": "SHP-002 is held: No better option - hold and notify. Revised ETA 2026-10-19, 5 days later than booked, past the required-by date."
   },
   {
    "seq": 7,
    "from": "Milestones Worker",
    "from_id": "milestones",
    "to": "Risk Worker",
    "to_id": "risk",
    "kind": "query",
    "text": "What is SHP-002's route exposed to?"
   },
   {
    "seq": 8,
    "from": "Risk Worker",
    "from_id": "risk",
    "to": "Milestones Worker",
    "to_id": "milestones",
    "kind": "reply",
    "text": "Warning strike at Port of Hamburg - union calls full-day walkout (high, first seen via NDR Hamburg)"
   },
   {
    "seq": 9,
    "from": "Milestones Worker",
    "from_id": "milestones",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "SHP-002 (Refrigerated pharma (reefer), Ningbo to Hamburg) is booked to arrive 2026-10-14 on Asia -> Suez -> Hamburg. SHP-002 is held: No better option - hold and notify. Revised ETA 2026-10-19, 5 days later than booked, past the required-by date."
   }
  ],
  "text": "SHP-002 (Refrigerated pharma (reefer), Ningbo to Hamburg) is booked to arrive 2026-10-14 on Asia -> Suez -> Hamburg. SHP-002 is held: No better option - hold and notify. Revised ETA 2026-10-19, 5 days later than booked, past the required-by date.",
  "facts": [
   {
    "label": "SHP-002 ETA",
    "value": "2026-10-14"
   },
   {
    "label": "Required by",
    "value": "2026-10-15"
   },
   {
    "label": "State",
    "value": "hold"
   }
  ],
  "links": [
   {
    "label": "SHP-002",
    "view": "shipments",
    "id": "SHP-002"
   }
  ],
  "suggestions": [],
  "answered": true,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "Why was SHP-001 rerouted?": {
  "question": "Why was SHP-001 rerouted?",
  "routed_to": {
   "id": "routing",
   "name": "Routing Worker",
   "mode": "live"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: why, reroute, rerouted",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "Why was SHP-001 rerouted?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "Routing Worker",
    "to_id": "routing",
    "kind": "handoff",
    "text": "Why was SHP-001 rerouted?",
    "why": "Routed by rules: strongest cues: why, reroute, rerouted."
   },
   {
    "seq": 3,
    "from": "Routing Worker",
    "from_id": "routing",
    "to": "Risk Worker",
    "to_id": "risk",
    "kind": "query",
    "text": "What made you flag SHP-001's route?"
   },
   {
    "seq": 4,
    "from": "Risk Worker",
    "from_id": "risk",
    "to": "Routing Worker",
    "to_id": "routing",
    "kind": "reply",
    "text": "Warning strike at Port of Hamburg - union calls full-day walkout - expected delay 3-5 days"
   },
   {
    "seq": 5,
    "from": "Routing Worker",
    "from_id": "routing",
    "to": "Comms Worker",
    "to_id": "comms",
    "kind": "query",
    "text": "Has SHP-001 been drafted to anyone?"
   },
   {
    "seq": 6,
    "from": "Comms Worker",
    "from_id": "comms",
    "to": "Routing Worker",
    "to_id": "routing",
    "kind": "reply",
    "text": "2 drafts, all waiting at the gate: carrier to Booking Desk, Hapag-Lloyd, customer to Katrin Vogel, Inbound Logistics, Bavaria Drivetrain GmbH."
   },
   {
    "seq": 7,
    "from": "Routing Worker",
    "from_id": "routing",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "SHP-001 is rerouted: Reroute via RTM - +2d, inside 4d slack. Revised ETA 2026-10-13, 2 days later than booked. Staying on R-HAM-STD projects up to 5 days of delay against 4 days of slack, which breaks the deadline. R-RTM-ALT adds 2 days of transit and carries no active risk, so it lands inside the slack."
   }
  ],
  "text": "SHP-001 is rerouted: Reroute via RTM - +2d, inside 4d slack. Revised ETA 2026-10-13, 2 days later than booked. Staying on R-HAM-STD projects up to 5 days of delay against 4 days of slack, which breaks the deadline. R-RTM-ALT adds 2 days of transit and carries no active risk, so it lands inside the slack.",
  "facts": [
   {
    "label": "SHP-001 decided by",
    "value": "rule (--no-llm)"
   }
  ],
  "links": [
   {
    "label": "SHP-001",
    "view": "shipments",
    "id": "SHP-001"
   }
  ],
  "suggestions": [],
  "answered": true,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "What is happening in Hamburg?": {
  "question": "What is happening in Hamburg?",
  "routed_to": {
   "id": "risk",
   "name": "Risk Worker",
   "mode": "live"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: what is happening",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "What is happening in Hamburg?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "Risk Worker",
    "to_id": "risk",
    "kind": "handoff",
    "text": "What is happening in Hamburg?",
    "why": "Routed by rules: strongest cues: what is happening."
   },
   {
    "seq": 3,
    "from": "Risk Worker",
    "from_id": "risk",
    "to": "Routing Worker",
    "to_id": "routing",
    "kind": "query",
    "text": "Which bookings did EVT-HAM-STRIKE move?"
   },
   {
    "seq": 4,
    "from": "Routing Worker",
    "from_id": "routing",
    "to": "Risk Worker",
    "to_id": "risk",
    "kind": "reply",
    "text": "SHP-001 is rerouted: Reroute via RTM - +2d, inside 4d slack. Revised ETA 2026-10-13, 2 days later than booked.; SHP-002 is held: No better option - hold and notify. Revised ETA 2026-10-19, 5 days later than booked, past the required-by date.; SHP-005 is rerouted: Reroute via RTM - +2d, inside 3d slack. Revised ETA 2026-10-14, 2 days later than booked."
   },
   {
    "seq": 5,
    "from": "Risk Worker",
    "from_id": "risk",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "Warning strike at Port of Hamburg - union calls full-day walkout (high, strike), first seen via NDR Hamburg, 23h before the international wires. It moved 3 bookings: SHP-001, SHP-002, SHP-005."
   }
  ],
  "text": "Warning strike at Port of Hamburg - union calls full-day walkout (high, strike), first seen via NDR Hamburg, 23h before the international wires. It moved 3 bookings: SHP-001, SHP-002, SHP-005.",
  "facts": [],
  "links": [
   {
    "label": "SHP-001",
    "view": "shipments",
    "id": "SHP-001"
   },
   {
    "label": "SHP-002",
    "view": "shipments",
    "id": "SHP-002"
   },
   {
    "label": "SHP-005",
    "view": "shipments",
    "id": "SHP-005"
   },
   {
    "label": "Risk feed",
    "view": "risk"
   }
  ],
  "suggestions": [],
  "answered": true,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "What is waiting for my approval?": {
  "question": "What is waiting for my approval?",
  "routed_to": {
   "id": "tms",
   "name": "TMS Link",
   "mode": "demo"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: approval",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "What is waiting for my approval?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "TMS Link",
    "to_id": "tms",
    "kind": "handoff",
    "text": "What is waiting for my approval?",
    "why": "Routed by rules: strongest cues: approval."
   },
   {
    "seq": 3,
    "from": "TMS Link",
    "from_id": "tms",
    "to": "Comms Worker",
    "to_id": "comms",
    "kind": "query",
    "text": "How many of your drafts are waiting?"
   },
   {
    "seq": 4,
    "from": "Comms Worker",
    "from_id": "comms",
    "to": "TMS Link",
    "to_id": "tms",
    "kind": "reply",
    "text": "6 drafts from the disruption run, none sent."
   },
   {
    "seq": 5,
    "from": "TMS Link",
    "from_id": "tms",
    "to": "Inbox Worker",
    "to_id": "inbox",
    "kind": "query",
    "text": "What did the desk queue from the inbox?"
   },
   {
    "seq": 6,
    "from": "Inbox Worker",
    "from_id": "inbox",
    "to": "TMS Link",
    "to_id": "tms",
    "kind": "reply",
    "text": "24 outputs - replies, quotes and TMS changes - each gated.",
    "why": "Demo connector. No TMS is contacted and nothing is written - a write-back is a described change, held at the approval gate."
   },
   {
    "seq": 7,
    "from": "TMS Link",
    "from_id": "tms",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "TMS (demo connector) is connected (demo). 36 items wait for your approval: 12 write-backs from the disruption run (SHP-001: 4; SHP-002: 4; SHP-005: 4) and 24 from the desk's inbox. Demo connector. No TMS is contacted and nothing is written - a write-back is a described change, held at the approval gate."
   }
  ],
  "text": "TMS (demo connector) is connected (demo). 36 items wait for your approval: 12 write-backs from the disruption run (SHP-001: 4; SHP-002: 4; SHP-005: 4) and 24 from the desk's inbox. Demo connector. No TMS is contacted and nothing is written - a write-back is a described change, held at the approval gate.",
  "facts": [
   {
    "label": "Connector",
    "value": "TMS (demo connector)"
   },
   {
    "label": "Bookings read",
    "value": "7"
   },
   {
    "label": "Queued",
    "value": "12"
   }
  ],
  "links": [
   {
    "label": "Approvals",
    "view": "approvals"
   },
   {
    "label": "TMS link",
    "view": "tms"
   }
  ],
  "suggestions": [],
  "answered": true,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "Price 2 x 40HC Shanghai to Rotterdam": {
  "question": "Price 2 x 40HC Shanghai to Rotterdam",
  "routed_to": {
   "id": "rate",
   "name": "Rate Worker",
   "mode": "live"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: price",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "Price 2 x 40HC Shanghai to Rotterdam"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "Rate Worker",
    "to_id": "rate",
    "kind": "handoff",
    "text": "Price 2 x 40HC Shanghai to Rotterdam",
    "why": "Routed by rules: strongest cues: price."
   },
   {
    "seq": 3,
    "from": "Rate Worker",
    "from_id": "rate",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "reply",
    "text": "8 options; best MSC on R-RTM-STD, EUR 2,330 per 40HC, 33 days.",
    "why": "Every carrier on a route into the lane, priced from the rate sheet: Cape routings last, then cheapest, then fastest."
   },
   {
    "seq": 4,
    "from": "Rate Worker",
    "from_id": "rate",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "2 x 40HC Shanghai to Rotterdam: MSC via R-RTM-STD: EUR 4,660 (33 days); CMA CGM via R-RTM-STD: EUR 4,800 (33 days); Maersk via R-RTM-STD: EUR 4,940 (33 days); MSC via R-RTM-ALT: EUR 5,080 (34 days). Reference rates from the desk's synthetic rate sheet, not market rates - a quote goes out only as a draft you approve."
   }
  ],
  "text": "2 x 40HC Shanghai to Rotterdam: MSC via R-RTM-STD: EUR 4,660 (33 days); CMA CGM via R-RTM-STD: EUR 4,800 (33 days); Maersk via R-RTM-STD: EUR 4,940 (33 days); MSC via R-RTM-ALT: EUR 5,080 (34 days). Reference rates from the desk's synthetic rate sheet, not market rates - a quote goes out only as a draft you approve.",
  "facts": [
   {
    "label": "Best",
    "value": "MSC, EUR 4,660"
   }
  ],
  "links": [],
  "suggestions": [],
  "answered": true,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "Which invoices are disputed?": {
  "question": "Which invoices are disputed?",
  "routed_to": {
   "id": "invoice",
   "name": "Invoice Worker",
   "mode": "live"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: invoice, dispute",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "Which invoices are disputed?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "Invoice Worker",
    "to_id": "invoice",
    "kind": "handoff",
    "text": "Which invoices are disputed?",
    "why": "Routed by rules: strongest cues: invoice, dispute."
   },
   {
    "seq": 3,
    "from": "Invoice Worker",
    "from_id": "invoice",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "IN-110 from Hapag-Lloyd: carrier invoice, worked by Inbox Worker -> Invoice Worker -> Playbook Worker. Invoice Worker invoice (QUEUED - not written); Invoice Worker Query on Freight invoice HL-88213407 (DRAFT - not sent)."
   }
  ],
  "text": "IN-110 from Hapag-Lloyd: carrier invoice, worked by Inbox Worker -> Invoice Worker -> Playbook Worker. Invoice Worker invoice (QUEUED - not written); Invoice Worker Query on Freight invoice HL-88213407 (DRAFT - not sent).",
  "facts": [],
  "links": [
   {
    "label": "IN-110",
    "view": "desk",
    "id": "IN-110"
   }
  ],
  "suggestions": [],
  "answered": true,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "What are Nordmed Pharma's rules?": {
  "question": "What are Nordmed Pharma's rules?",
  "routed_to": {
   "id": "playbook",
   "name": "Playbook Worker",
   "mode": "live"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: rules",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "What are Nordmed Pharma's rules?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "Playbook Worker",
    "to_id": "playbook",
    "kind": "handoff",
    "text": "What are Nordmed Pharma's rules?",
    "why": "Routed by rules: strongest cues: rules."
   },
   {
    "seq": 3,
    "from": "Playbook Worker",
    "from_id": "playbook",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "Nordmed Pharma Logistik AG: approved carriers: Maersk, Hapag-Lloyd (GDP-audited reefer carriers only - vaccines); cc on customer mail: qa-logistics@nordmed-pharma.example (Quality assurance sees every shipment mail); notify delay over days: 0 (Cold chain: any slip is reported). Every output for them is checked against these before it reaches the gate."
   }
  ],
  "text": "Nordmed Pharma Logistik AG: approved carriers: Maersk, Hapag-Lloyd (GDP-audited reefer carriers only - vaccines); cc on customer mail: qa-logistics@nordmed-pharma.example (Quality assurance sees every shipment mail); notify delay over days: 0 (Cold chain: any slip is reported). Every output for them is checked against these before it reaches the gate.",
  "facts": [],
  "links": [],
  "suggestions": [],
  "answered": true,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "Where is SHP-099?": {
  "question": "Where is SHP-099?",
  "routed_to": null,
  "routed_by": "rules",
  "route_reason": "the booking named is not in the book",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "Where is SHP-099?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "TMS Link",
    "to_id": "tms",
    "kind": "query",
    "text": "Is SHP-099 in the book?"
   },
   {
    "seq": 3,
    "from": "TMS Link",
    "from_id": "tms",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "reply",
    "text": "No - SHP-099 is not among the 7 bookings read from TMS (demo connector)."
   }
  ],
  "text": "SHP-099 is not in the book the agents are working on (TMS (demo connector)). No Worker can answer for a booking it cannot read.",
  "facts": [],
  "links": [],
  "suggestions": [
   "Check the reference - the board's ids are SHP-001, SHP-002, SHP-003, SHP-004, SHP-005, SHP-006, SHP-007.",
   "If it lives in your own TMS, connect it on the TMS link page and ask again."
  ],
  "answered": false,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 },
 "What's the weather in Paris tomorrow?": {
  "question": "What's the weather in Paris tomorrow?",
  "routed_to": {
   "id": "risk",
   "name": "Risk Worker",
   "mode": "live"
  },
  "routed_by": "rules",
  "route_reason": "strongest cues: weather",
  "conversation": [
   {
    "seq": 1,
    "from": "You",
    "from_id": "you",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "ask",
    "text": "What's the weather in Paris tomorrow?"
   },
   {
    "seq": 2,
    "from": "Assistant",
    "from_id": "assistant",
    "to": "Risk Worker",
    "to_id": "risk",
    "kind": "handoff",
    "text": "What's the weather in Paris tomorrow?",
    "why": "Routed by rules: strongest cues: weather."
   },
   {
    "seq": 3,
    "from": "Risk Worker",
    "from_id": "risk",
    "to": "Assistant",
    "to_id": "assistant",
    "kind": "reply",
    "text": "I do not watch Paris. I watch the board's lanes: Hamburg, Rotterdam, Antwerp, Suez Canal, Red Sea, Cape of Good Hope, Rhine, Fos-sur-Mer, Rhone corridor.",
    "why": "A place off every lane on the board moves no booking, so no source is pointed at it."
   },
   {
    "seq": 4,
    "from": "Risk Worker",
    "from_id": "risk",
    "to": "You",
    "to_id": "you",
    "kind": "answer",
    "text": "No Worker watches Paris: it is not on any lane the board's bookings travel. The Risk Worker watches Hamburg, Rotterdam, Antwerp, Suez Canal, Red Sea, Cape of Good Hope, Rhine, Fos-sur-Mer, Rhone corridor."
   }
  ],
  "text": "No Worker watches Paris: it is not on any lane the board's bookings travel. The Risk Worker watches Hamburg, Rotterdam, Antwerp, Suez Canal, Red Sea, Cape of Good Hope, Rhine, Fos-sur-Mer, Rhone corridor.",
  "facts": [],
  "links": [],
  "suggestions": [
   "Ask about a port or chokepoint on the board, e.g. \"What is happening in Rotterdam?\"",
   "If that place matters to your lanes, it is a new source to add - one function in src/signals.py or a feed in config."
  ],
  "answered": false,
  "checked_against": {
   "scenario": "Hamburg port strike",
   "connector": "TMS (demo connector)",
   "bookings": 7,
   "note": "Answered from a fresh rules-only run of this board. Pressing Run reads the live sources and lets the model decide."
  }
 }
} as const;

export const recordedSampleConnection = {
 "kind": "file",
 "name": "Your TMS (export: sample_tms_export.csv)",
 "source": "sample_tms_export.csv",
 "read_at": "2026-09-25T22:15:27+00:00",
 "rows_read": 10,
 "bookings": [
  {
   "id": "JOB-24117",
   "cargo": "Industrial pumps",
   "cargo_detail": null,
   "origin": "Shanghai (CNSHA)",
   "final_destination": "Stuttgart",
   "primary_route": "R-HAM-STD",
   "alternates": [
    "R-RTM-ALT",
    "R-COGH-ALT"
   ],
   "deadline_slack_days": 6,
   "notes": "Read from your TMS.",
   "customer": "Kessler Pumpen GmbH",
   "customer_contact": null,
   "carrier": "Hapag-Lloyd",
   "booking_ref": "HLCU-7719031",
   "container": "4 x 40HC",
   "etd": "2026-09-02",
   "eta": "2026-10-06",
   "required_by": "2026-10-12",
   "cold_chain": false,
   "special_requirements": null,
   "commercial": {
    "freight_eur": 14200,
    "late_eur_per_day": 1200,
    "breach_eur": 0,
    "transfer_risk_eur": 0,
    "basis": "Read from your TMS export."
   },
   "tms_row": 1
  },
  {
   "id": "JOB-24121",
   "cargo": "Frozen seafood",
   "cargo_detail": null,
   "origin": "Busan (KRPUS)",
   "final_destination": "Hamburg",
   "primary_route": "R-HAM-STD",
   "alternates": [
    "R-RTM-ALT",
    "R-COGH-ALT"
   ],
   "deadline_slack_days": 1,
   "notes": "Read from your TMS.",
   "customer": "Nordsee Frischkost GmbH",
   "customer_contact": null,
   "carrier": "MSC",
   "booking_ref": "MSCU-5520488",
   "container": "2 x 40RF",
   "etd": "2026-09-04",
   "eta": "2026-10-04",
   "required_by": "2026-10-05",
   "cold_chain": true,
   "special_requirements": "Keep frozen; no transhipment",
   "commercial": {
    "freight_eur": 9600,
    "late_eur_per_day": 0,
    "breach_eur": 0,
    "transfer_risk_eur": 0,
    "basis": "Read from your TMS export."
   },
   "tms_row": 2
  },
  {
   "id": "JOB-24126",
   "cargo": "Bicycle frames",
   "cargo_detail": null,
   "origin": "Kaohsiung (TWKHH)",
   "final_destination": "Berlin",
   "primary_route": "R-HAM-STD",
   "alternates": [
    "R-RTM-ALT",
    "R-COGH-ALT"
   ],
   "deadline_slack_days": 3,
   "notes": "Read from your TMS.",
   "customer": "Velotechnik Berlin GmbH",
   "customer_contact": null,
   "carrier": "COSCO",
   "booking_ref": "COSU-6604417",
   "container": "3 x 40HC",
   "etd": "2026-09-05",
   "eta": "2026-10-08",
   "required_by": "2026-10-11",
   "cold_chain": false,
   "special_requirements": null,
   "commercial": {
    "freight_eur": 11900,
    "late_eur_per_day": 2500,
    "breach_eur": 0,
    "transfer_risk_eur": 0,
    "basis": "Read from your TMS export."
   },
   "tms_row": 3
  },
  {
   "id": "JOB-24133",
   "cargo": "Solar inverters",
   "cargo_detail": null,
   "origin": "Ningbo (CNNGB)",
   "final_destination": "Rotterdam",
   "primary_route": "R-RTM-STD",
   "alternates": [
    "R-COGH-RTM"
   ],
   "deadline_slack_days": 6,
   "notes": "Read from your TMS.",
   "customer": "Zonnekracht B.V.",
   "customer_contact": null,
   "carrier": "ONE",
   "booking_ref": "ONEY-3381920",
   "container": "6 x 40HC",
   "etd": "2026-09-06",
   "eta": "2026-10-08",
   "required_by": "2026-10-14",
   "cold_chain": false,
   "special_requirements": null,
   "commercial": {
    "freight_eur": 19800,
    "late_eur_per_day": 1800,
    "breach_eur": 0,
    "transfer_risk_eur": 0,
    "basis": "Read from your TMS export."
   },
   "tms_row": 4
  },
  {
   "id": "JOB-24140",
   "cargo": "Cotton garments",
   "cargo_detail": null,
   "origin": "Ho Chi Minh City (VNSGN)",
   "final_destination": "Brussels",
   "primary_route": "R-ANR-STD",
   "alternates": [
    "R-COGH-ANR"
   ],
   "deadline_slack_days": 4,
   "notes": "Read from your TMS.",
   "customer": "Maison Lintel SA",
   "customer_contact": null,
   "carrier": "CMA CGM",
   "booking_ref": "CMAU-8812004",
   "container": "2 x 40HC",
   "etd": "2026-09-03",
   "eta": "2026-10-05",
   "required_by": "2026-10-09",
   "cold_chain": false,
   "special_requirements": null,
   "commercial": {
    "freight_eur": 7400,
    "late_eur_per_day": 900,
    "breach_eur": 0,
    "transfer_risk_eur": 0,
    "basis": "Read from your TMS export."
   },
   "tms_row": 5
  },
  {
   "id": "JOB-24152",
   "cargo": "Lab glassware",
   "cargo_detail": null,
   "origin": "Qingdao (CNTAO)",
   "final_destination": "Basel",
   "primary_route": "R-RTM-RHINE",
   "alternates": [
    "R-RTM-RAIL",
    "R-COGH-BSL"
   ],
   "deadline_slack_days": 6,
   "notes": "Read from your TMS.",
   "customer": "Rheinlab AG",
   "customer_contact": null,
   "carrier": "Maersk",
   "booking_ref": "MAEU-2217750",
   "container": "1 x 40HC",
   "etd": "2026-09-01",
   "eta": "2026-10-07",
   "required_by": "2026-10-13",
   "cold_chain": false,
   "special_requirements": "Fragile - Rhine barge preferred",
   "commercial": {
    "freight_eur": 6100,
    "late_eur_per_day": 700,
    "breach_eur": 0,
    "transfer_risk_eur": 0,
    "basis": "Read from your TMS export."
   },
   "tms_row": 6
  },
  {
   "id": "JOB-24160",
   "cargo": "Kitchen appliances",
   "cargo_detail": null,
   "origin": "Yantian (CNYTN)",
   "final_destination": "Lyon",
   "primary_route": "R-FOS-STD",
   "alternates": [
    "R-ANR-LYON",
    "R-COGH-FOS"
   ],
   "deadline_slack_days": 7,
   "notes": "Read from your TMS.",
   "customer": "Électroménager Rhône SAS",
   "customer_contact": null,
   "carrier": "CMA CGM",
   "booking_ref": "CMAU-9043126",
   "container": "3 x 40HC",
   "etd": "2026-09-05",
   "eta": "2026-10-03",
   "required_by": "2026-10-10",
   "cold_chain": false,
   "special_requirements": null,
   "commercial": {
    "freight_eur": 10300,
    "late_eur_per_day": 1100,
    "breach_eur": 0,
    "transfer_risk_eur": 0,
    "basis": "Read from your TMS export."
   },
   "tms_row": 7
  }
 ],
 "not_covered": [
  {
   "row": 8,
   "ref": "JOB-24166",
   "reason": "discharge 'Los Angeles (USLAX)' is not a port the catalogue models (Hamburg, Rotterdam, Antwerp, Fos) or an inland leg it covers"
  },
  {
   "row": 9,
   "ref": "JOB-24171",
   "reason": "discharge 'Gdansk (PLGDN)' is not a port the catalogue models (Hamburg, Rotterdam, Antwerp, Fos) or an inland leg it covers"
  },
  {
   "row": 10,
   "ref": "JOB-24175",
   "reason": "no readable ETA - the delay is measured from it"
  }
 ],
 "mapping": [
  {
   "column": "Shipment No",
   "field": "id",
   "used_for": "the booking's id on the board"
  },
  {
   "column": "Carrier Booking",
   "field": "booking_ref",
   "used_for": "the carrier's booking reference"
  },
  {
   "column": "Commodity",
   "field": "cargo",
   "used_for": "what is being moved"
  },
  {
   "column": "POL",
   "field": "origin",
   "used_for": "the load port - picks the lane"
  },
  {
   "column": "POD",
   "field": "port_of_discharge",
   "used_for": "the discharge port - picks the lane"
  },
  {
   "column": "Final Destination",
   "field": "final_destination",
   "used_for": "where it is delivered - picks the inland leg"
  },
  {
   "column": "ETD",
   "field": "etd",
   "used_for": "departure date"
  },
  {
   "column": "ETA",
   "field": "eta",
   "used_for": "arrival date - the delay is measured from it"
  },
  {
   "column": "RDD",
   "field": "required_by",
   "used_for": "the customer's date - slack is measured to it"
  },
  {
   "column": "Carrier",
   "field": "carrier",
   "used_for": "who the carrier mail goes to"
  },
  {
   "column": "Consignee",
   "field": "customer",
   "used_for": "who the customer mail goes to"
  },
  {
   "column": "Containers",
   "field": "container",
   "used_for": "the equipment on the booking"
  },
  {
   "column": "Reefer",
   "field": "cold_chain",
   "used_for": "reefer - a port change is a cold-chain transfer"
  },
  {
   "column": "Freight EUR",
   "field": "freight_eur",
   "used_for": "freight value - prices a reroute's premium"
  },
  {
   "column": "Late Penalty per Day",
   "field": "late_eur_per_day",
   "used_for": "what a day late costs"
  },
  {
   "column": "Remarks",
   "field": "special_requirements",
   "used_for": "handling notes the drafts respect"
  }
 ],
 "unmapped_columns": [],
 "warnings": []
};

/** Recorded GET /api/insights?scenario=hamburg, for the Dashboard's offline fallback. */
export const recordedInsights = {
 "title": "Desk insights",
 "subtitle": "This morning's inbox and the Hamburg port strike board",
 "cards": [
  {
   "label": "Mails worked",
   "value": "13",
   "caption": "every inbound mail, triaged and routed"
  },
  {
   "label": "Handled end to end",
   "value": "62%",
   "caption": "8 of 13 needed no person before approval"
  },
  {
   "label": "Escalated to a person",
   "value": "5",
   "caption": "held rather than guessed"
  },
  {
   "label": "Waiting for you",
   "value": "36",
   "caption": "drafts and TMS changes at the gate"
  }
 ],
 "workload": {
  "title": "Work by agent",
  "subtitle": "Messages each agent posted on the desk's bus in this run",
  "bars": [
   {
    "label": "Playbook",
    "value": 28
   },
   {
    "label": "Booking",
    "value": 28
   },
   {
    "label": "Inbox",
    "value": 13
   },
   {
    "label": "Routing",
    "value": 8
   },
   {
    "label": "Rate",
    "value": 7
   },
   {
    "label": "Docs",
    "value": 7
   },
   {
    "label": "Exception",
    "value": 6
   },
   {
    "label": "RFQ",
    "value": 5
   },
   {
    "label": "Milestones",
    "value": 4
   },
   {
    "label": "Invoice",
    "value": 2
   },
   {
    "label": "Customs",
    "value": 1
   }
  ]
 },
 "mix": {
  "title": "What the inbox asked for",
  "subtitle": "Share of this morning's mails, by what the Inbox Worker read them as",
  "rows": [
   {
    "label": "Booking request",
    "count": 4,
    "share": 31
   },
   {
    "label": "Documents",
    "count": 2,
    "share": 15
   },
   {
    "label": "Arrival notice",
    "count": 2,
    "share": 15
   },
   {
    "label": "Rate request",
    "count": 1,
    "share": 8
   },
   {
    "label": "Carrier notice",
    "count": 1,
    "share": 8
   },
   {
    "label": "Status request",
    "count": 1,
    "share": 8
   },
   {
    "label": "Carrier invoice",
    "count": 1,
    "share": 8
   },
   {
    "label": "Milestone",
    "count": 1,
    "share": 7
   }
  ]
 },
 "approvals": {
  "title": "Where your approvals come from",
  "subtitle": "Items waiting at the gate, by the agent that produced them",
  "rows": [
   {
    "label": "Booking Worker",
    "count": 9,
    "share": 25
   },
   {
    "label": "Comms Worker",
    "count": 6,
    "share": 17
   },
   {
    "label": "Exception Worker",
    "count": 4,
    "share": 11
   },
   {
    "label": "Milestones Worker",
    "count": 3,
    "share": 8
   },
   {
    "label": "Risk Worker",
    "count": 3,
    "share": 8
   },
   {
    "label": "Routing Worker",
    "count": 3,
    "share": 8
   },
   {
    "label": "RFQ Worker",
    "count": 2,
    "share": 6
   },
   {
    "label": "Docs Worker",
    "count": 2,
    "share": 6
   },
   {
    "label": "Invoice Worker",
    "count": 2,
    "share": 6
   },
   {
    "label": "Customs Worker",
    "count": 2,
    "share": 5
   }
  ]
 },
 "note": "Counted from one run - the desk's synthetic inbox and the board as it stands. There is no history yet, so nothing here is a trend."
};
