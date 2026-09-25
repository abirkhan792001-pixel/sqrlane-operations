export const recordedRun = {
  "GET /api/initial (before the button)": {
    "shipments_count": 7,
    "state": "idle"
  },
  "POST /run (after 'Inject Hamburg strike')": {
    "ran_at": "2026-09-25T20:48:37+00:00",
    "duration_seconds": 0.0,
    "scenario": {
      "id": "hamburg",
      "name": "Hamburg port strike",
      "kind": "Port blocked",
      "summary": "A full-day walkout closes Hamburg's container terminals. Shipments with slack move to Rotterdam; the tight cold-chain one is better off waiting."
    },
    "scenarios": [
      {
        "id": "hamburg",
        "name": "Hamburg port strike",
        "kind": "Port blocked"
      },
      {
        "id": "redsea",
        "name": "Red Sea closure",
        "kind": "Chokepoint closed"
      },
      {
        "id": "rhine",
        "name": "Rhine low water",
        "kind": "Inland waterway disrupted"
      }
    ],
    "ai": {
      "provider": null,
      "model": null,
      "model_source": "",
      "decisions_from_model": 0,
      "decisions_total": 7,
      "drafts_from_model": 0,
      "drafts_total": 6
    },
    "summary": {
      "reroute": 2,
      "hold": 1,
      "no-action": 4,
      "drafts": 6
    },
    "workers": [
      {
        "id": "risk",
        "name": "Risk Worker",
        "mode": "live",
        "layer": null,
        "summary": "0 of 1 sources read · 1 event"
      },
      {
        "id": "routing",
        "name": "Routing Worker",
        "mode": "live",
        "layer": null,
        "summary": "7 shipments triaged · 2 reroute, 1 hold, 4 on plan"
      },
      {
        "id": "comms",
        "name": "Comms Worker",
        "mode": "live",
        "layer": null,
        "summary": "6 drafts for 3 shipments · none sent"
      },
      {
        "id": "planner",
        "name": "Planner Worker",
        "mode": "scripted",
        "layer": "risk",
        "summary": "authored sweep · 3 forward bookings swept · 1 act now · 1 tripwire armed · 1 standing down"
      },
      {
        "id": "inbox",
        "name": "Inbox Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "works the inbox in Workflow"
      },
      {
        "id": "playbook",
        "name": "Playbook Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "2 customer mails checked · works the inbox in Workflow"
      },
      {
        "id": "rate",
        "name": "Rate Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "works the inbox in Workflow"
      },
      {
        "id": "rfq",
        "name": "RFQ Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "works the inbox in Workflow"
      },
      {
        "id": "booking",
        "name": "Booking Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "3 handoffs from this run · works the inbox in Workflow"
      },
      {
        "id": "docs",
        "name": "Docs Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "works the inbox in Workflow"
      },
      {
        "id": "milestones",
        "name": "Milestones Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "3 handoffs from this run · works the inbox in Workflow"
      },
      {
        "id": "exception",
        "name": "Exception Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "works the inbox in Workflow"
      },
      {
        "id": "invoice",
        "name": "Invoice Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "works the inbox in Workflow"
      },
      {
        "id": "customs",
        "name": "Customs Worker",
        "mode": "live",
        "layer": "workflow",
        "summary": "2 handoffs from this run · works the inbox in Workflow"
      },
      {
        "id": "assistant",
        "name": "Assistant",
        "mode": "scripted",
        "layer": "workflow",
        "summary": "scripted — replays authored data"
      },
      {
        "id": "tms",
        "name": "TMS Link",
        "mode": "demo",
        "layer": "record",
        "summary": "7 bookings in · 12 changes queued back"
      }
    ],
    "risk": {
      "live_sources_total": 1,
      "live_sources_read": 0,
      "families": [],
      "events": [
        {
          "event_id": "EVT-HAM-STRIKE",
          "title": "Warning strike at Port of Hamburg - union calls full-day walkout",
          "chokepoint": "HAM",
          "type": "strike",
          "severity": "high",
          "source": "NDR Hamburg (German-language regional RSS)",
          "origin": "injected",
          "expected_duration_hours": [
            48,
            72
          ]
        }
      ]
    },
    "shipments": [
      {
        "id": "SHP-001",
        "cargo": "Automotive parts",
        "origin": "Shanghai",
        "final_destination": "Munich",
        "customer": "Bavaria Drivetrain GmbH",
        "carrier": "Hapag-Lloyd",
        "booking_ref": "HLCU-2261188",
        "cold_chain": false,
        "route_id": "R-HAM-STD",
        "discharge_port": "HAM",
        "eta": "2026-10-11",
        "required_by": "2026-10-15",
        "slack_days": 4,
        "state": "rerouted",
        "decision": {
          "decision": "reroute",
          "headline": "Reroute via RTM - +2d, inside 4d slack",
          "reasoning": "Staying on R-HAM-STD projects up to 5 days of delay against 4 days of slack, which breaks the deadline. R-RTM-ALT adds 2 days of transit and carries no active risk, so it lands inside the slack.",
          "recommended_route": "R-RTM-ALT",
          "recommended_discharge_port": "RTM",
          "delay_days": 2,
          "revised_eta": "2026-10-13",
          "triggering_events": [
            "EVT-HAM-STRIKE"
          ],
          "decided_by": "rule (--no-llm)"
        },
        "drafts": [
          {
            "audience": "carrier",
            "to": "Booking Desk, Hapag-Lloyd",
            "subject": "HLCU-2261188 - amend discharge to RTM",
            "status": "DRAFT - not sent",
            "approval_status": "awaiting_approval",
            "body": "Booking HLCU-2261188 / HLXU4471902 + 11\nShanghai - Munich, 12 x 40HC, assembled brake and suspension components\n\nPlease amend the booking to discharge at RTM instead of HAM, and confirm the revised discharge schedule.\n\nRevised ETA on our side is 2026-10-13.\nPlease confirm by return.\n\nLena Brandt\nHea…"
          },
          {
            "audience": "customer",
            "to": "Katrin Vogel, Inbound Logistics, Bavaria Drivetrain GmbH",
            "subject": "HLCU-2261188 Automotive parts - revised ETA 2026-10-13",
            "status": "DRAFT - not sent",
            "approval_status": "awaiting_approval",
            "body": "Dear Katrin Vogel,\n\nAn update on your automotive parts shipment HLCU-2261188: we are bringing it in through Rotterdam instead of Hamburg, which puts arrival at 2026-10-13 - 2 days later than planned.\n\nThere is industrial action at Hamburg that we expect to hold cargo there for several days. Routing …"
          }
        ]
      },
      {
        "id": "SHP-002",
        "cargo": "Refrigerated pharma (reefer)",
        "origin": "Ningbo",
        "final_destination": "Hamburg",
        "customer": "Nordmed Pharma Logistik AG",
        "carrier": "Maersk",
        "booking_ref": "MAEU-9930472",
        "cold_chain": true,
        "route_id": "R-HAM-STD",
        "discharge_port": "HAM",
        "eta": "2026-10-14",
        "required_by": "2026-10-15",
        "slack_days": 1,
        "state": "hold",
        "decision": {
          "decision": "hold",
          "headline": "No better option - hold and notify",
          "reasoning": "Staying put projects up to 5 days of delay against 1 day of slack, but no alternate on file lands any better. Hold and tell the customer now.",
          "recommended_route": "R-HAM-STD",
          "recommended_discharge_port": "HAM",
          "delay_days": 5,
          "revised_eta": "2026-10-19",
          "triggering_events": [
            "EVT-HAM-STRIKE"
          ],
          "decided_by": "rule (--no-llm)"
        },
        "drafts": [
          {
            "audience": "carrier",
            "to": "Booking Desk, Maersk",
            "subject": "MAEU-9930472 - hold instruction",
            "status": "DRAFT - not sent",
            "approval_status": "awaiting_approval",
            "body": "Booking MAEU-9930472 / MNBU0182335, MNBU0182341\nNingbo - Hamburg, 2 x 40RH, temperature-controlled vaccine consignment\n\nPlease hold the containers rather than discharging into the current disruption, and confirm where they will sit and the revised discharge window.\n\nThese are reefers: confirm the un…"
          },
          {
            "audience": "customer",
            "to": "Dr. Anke Petersen, Supply Chain, Nordmed Pharma Logistik AG",
            "subject": "MAEU-9930472 Refrigerated pharma - revised ETA 2026-10-19",
            "status": "DRAFT - not sent",
            "approval_status": "awaiting_approval",
            "body": "Dear Dr. Anke Petersen,\n\nAn update on your refrigerated pharma shipment MAEU-9930472: we are holding it rather than rerouting, which puts arrival at 2026-10-19.\n\nThere is industrial action at Hamburg, which we expect to clear in a few days. Bringing the cargo in through another port would mean extra…"
          }
        ]
      },
      {
        "id": "SHP-003",
        "cargo": "Furniture",
        "origin": "Shanghai",
        "final_destination": "Rotterdam",
        "customer": "Wonen Direct B.V.",
        "carrier": "CMA CGM",
        "booking_ref": "CMDU-4410765",
        "cold_chain": false,
        "route_id": "R-RTM-STD",
        "discharge_port": "RTM",
        "eta": "2026-10-14",
        "required_by": "2026-10-17",
        "slack_days": 3,
        "state": "green",
        "decision": {
          "decision": "no-action",
          "headline": "No active risk on this route",
          "reasoning": "No active disruption touches SUEZ, REDSEA, RTM, so SHP-003 stays on R-RTM-STD and keeps its 2026-10-14 ETA.",
          "recommended_route": "R-RTM-STD",
          "recommended_discharge_port": "RTM",
          "delay_days": 0,
          "revised_eta": "2026-10-14",
          "triggering_events": [],
          "decided_by": "rule (no risk on this route - no LLM call needed)"
        },
        "drafts": []
      },
      {
        "id": "SHP-004",
        "cargo": "Electronics",
        "origin": "Shenzhen",
        "final_destination": "Antwerp",
        "customer": "Kempen Electronics NV",
        "carrier": "MSC",
        "booking_ref": "MEDU-1774390",
        "cold_chain": false,
        "route_id": "R-ANR-STD",
        "discharge_port": "ANR",
        "eta": "2026-10-16",
        "required_by": "2026-10-18",
        "slack_days": 2,
        "state": "green",
        "decision": {
          "decision": "no-action",
          "headline": "No active risk on this route",
          "reasoning": "No active disruption touches SUEZ, REDSEA, ANR, so SHP-004 stays on R-ANR-STD and keeps its 2026-10-16 ETA.",
          "recommended_route": "R-ANR-STD",
          "recommended_discharge_port": "ANR",
          "delay_days": 0,
          "revised_eta": "2026-10-16",
          "triggering_events": [],
          "decided_by": "rule (no risk on this route - no LLM call needed)"
        },
        "drafts": []
      },
      {
        "id": "SHP-005",
        "cargo": "Machinery",
        "origin": "Busan",
        "final_destination": "Hamburg",
        "customer": "Elbe Werkzeugbau GmbH",
        "carrier": "Hapag-Lloyd",
        "booking_ref": "HLCU-2264903",
        "cold_chain": false,
        "route_id": "R-HAM-STD",
        "discharge_port": "HAM",
        "eta": "2026-10-12",
        "required_by": "2026-10-15",
        "slack_days": 3,
        "state": "rerouted",
        "decision": {
          "decision": "reroute",
          "headline": "Reroute via RTM - +2d, inside 3d slack",
          "reasoning": "Staying on R-HAM-STD projects up to 5 days of delay against 3 days of slack, which breaks the deadline. R-RTM-ALT adds 2 days of transit and carries no active risk, so it lands inside the slack.",
          "recommended_route": "R-RTM-ALT",
          "recommended_discharge_port": "RTM",
          "delay_days": 2,
          "revised_eta": "2026-10-14",
          "triggering_events": [
            "EVT-HAM-STRIKE"
          ],
          "decided_by": "rule (--no-llm)"
        },
        "drafts": [
          {
            "audience": "carrier",
            "to": "Booking Desk, Hapag-Lloyd",
            "subject": "HLCU-2264903 - amend discharge to RTM",
            "status": "DRAFT - not sent",
            "approval_status": "awaiting_approval",
            "body": "Booking HLCU-2264903 / HLXU9903118 + 2\nBusan - Hamburg, 3 x 40FR flatrack, CNC machining centre, out-of-gauge\n\nPlease amend the booking to discharge at RTM instead of HAM, and confirm the revised discharge schedule.\n\nBefore amending, please confirm RTM can take this cargo: Out-of-gauge flatrack carg…"
          },
          {
            "audience": "customer",
            "to": "Markus Lindner, Werkslogistik, Elbe Werkzeugbau GmbH",
            "subject": "HLCU-2264903 Machinery - revised ETA 2026-10-14",
            "status": "DRAFT - not sent",
            "approval_status": "awaiting_approval",
            "body": "Dear Markus Lindner,\n\nAn update on your machinery shipment HLCU-2264903: we are bringing it in through Rotterdam instead of Hamburg, which puts arrival at 2026-10-14 - 2 days later than planned.\n\nThere is industrial action at Hamburg that we expect to hold cargo there for several days. Routing throu…"
          }
        ]
      },
      {
        "id": "SHP-006",
        "cargo": "Industrial chemicals",
        "origin": "Shanghai",
        "final_destination": "Basel",
        "customer": "Rheintal Spezialchemie AG",
        "carrier": "CMA CGM",
        "booking_ref": "CMDU-5518824",
        "cold_chain": false,
        "route_id": "R-RTM-RHINE",
        "discharge_port": "RTM",
        "eta": "2026-10-15",
        "required_by": "2026-10-18",
        "slack_days": 3,
        "state": "green",
        "decision": {
          "decision": "no-action",
          "headline": "No active risk on this route",
          "reasoning": "No active disruption touches SUEZ, REDSEA, RTM, RHINE, so SHP-006 stays on R-RTM-RHINE and keeps its 2026-10-15 ETA.",
          "recommended_route": "R-RTM-RHINE",
          "recommended_discharge_port": "RTM",
          "delay_days": 0,
          "revised_eta": "2026-10-15",
          "triggering_events": [],
          "decided_by": "rule (no risk on this route - no LLM call needed)"
        },
        "drafts": []
      },
      {
        "id": "SHP-007",
        "cargo": "Textiles",
        "origin": "Shanghai",
        "final_destination": "Lyon",
        "customer": "Maison Cardelle SAS",
        "carrier": "MSC",
        "booking_ref": "MEDU-2209471",
        "cold_chain": false,
        "route_id": "R-FOS-STD",
        "discharge_port": "FOS",
        "eta": "2026-10-16",
        "required_by": "2026-10-21",
        "slack_days": 5,
        "state": "green",
        "decision": {
          "decision": "no-action",
          "headline": "No active risk on this route",
          "reasoning": "No active disruption touches SUEZ, REDSEA, FOS, FRINL, so SHP-007 stays on R-FOS-STD and keeps its 2026-10-16 ETA.",
          "recommended_route": "R-FOS-STD",
          "recommended_discharge_port": "FOS",
          "delay_days": 0,
          "revised_eta": "2026-10-16",
          "triggering_events": [],
          "decided_by": "rule (no risk on this route - no LLM call needed)"
        },
        "drafts": []
      }
    ],
    "tms": {
      "connector": "TMS (demo connector)",
      "status": "connected (demo)",
      "bookings_read": 7,
      "bookings_affected": 3,
      "queued": 12,
      "queued_by_agent": {
        "Risk Worker": 3,
        "Routing Worker": 3,
        "Comms Worker": 6
      },
      "honesty": "Demo connector. No TMS is contacted and nothing is written - a write-back is a described change, held at the approval gate.",
      "writebacks": [
        {
          "booking_ref": "SHP-001",
          "agent": "Risk Worker",
          "record": "exception",
          "operation": "flag_exception",
          "changes": [
            {
              "field": "exception_flag",
              "from": "none",
              "to": "EVT-HAM-STRIKE"
            }
          ],
          "reason": "R-HAM-STD is exposed to EVT-HAM-STRIKE. Revised ETA 2026-10-13, 2 days later than booked.",
          "status": "QUEUED - not written",
          "approval_status": "awaiting_approval"
        },
        {
          "booking_ref": "SHP-001",
          "agent": "Routing Worker",
          "record": "booking",
          "operation": "update_booking",
          "changes": [
            {
              "field": "port_of_discharge",
              "from": "HAM",
              "to": "RTM"
            },
            {
              "field": "routing_code",
              "from": "R-HAM-STD",
              "to": "R-RTM-ALT"
            },
            {
              "field": "booking_status",
              "from": "ON PLAN",
              "to": "REROUTED - amendment pending"
            },
            {
              "field": "eta",
              "from": "2026-10-11",
              "to": "2026-10-13"
            }
          ],
          "reason": "Reroute via RTM - +2d, inside 4d slack",
          "status": "QUEUED - not written",
          "approval_status": "awaiting_approval"
        },
        {
          "booking_ref": "SHP-001",
          "agent": "Comms Worker",
          "record": "communication_log",
          "operation": "file_communication",
          "changes": [
            {
              "field": "communication_log",
              "to": "carrier draft to Booking Desk, Hapag-Lloyd"
            }
          ],
          "reason": "HLCU-2261188 - amend discharge to RTM",
          "status": "QUEUED - not written",
          "approval_status": "awaiting_approval"
        },
        {
          "booking_ref": "SHP-001",
          "agent": "Comms Worker",
          "record": "communication_log",
          "operation": "file_communication",
          "changes": [
            {
              "field": "communication_log",
              "to": "customer draft to Katrin Vogel, Inbound Logistics, Bavaria Drivetrain GmbH"
            }
          ],
          "reason": "HLCU-2261188 Automotive parts - revised ETA 2026-10-13",
          "status": "QUEUED - not written",
          "approval_status": "awaiting_approval"
        },
        {
          "booking_ref": "SHP-002",
          "agent": "Risk Worker",
          "record": "exception",
          "operation": "flag_exception",
          "changes": [
            {
              "field": "exception_flag",
              "from": "none",
              "to": "EVT-HAM-STRIKE"
            }
          ],
          "reason": "R-HAM-STD is exposed to EVT-HAM-STRIKE. Revised ETA 2026-10-19, 5 days later than booked.",
          "status": "QUEUED - not written",
          "approval_status": "awaiting_approval"
        },
        {
          "booking_ref": "SHP-002",
          "agent": "Routing Worker",
          "record": "booking",
          "operation": "hold_booking",
          "changes": [
            {
              "field": "booking_status",
              "from": "ON PLAN",
              "to": "HELD - awaiting berth"
            },
            {
              "field": "eta",
              "from": "2026-10-14",
              "to": "2026-10-19"
            }
          ],
          "reason": "No better option - hold and notify",
          "status": "QUEUED - not written",
          "approval_status": "awaiting_approval"
        }
      ]
    }
  },
  "GET /api/workflow (the everyday desk)": {
    "stats": {
      "items": 13,
      "routed": 13,
      "mails": 10,
      "writes": 14,
      "escalations": 5,
      "needs_look": 3,
      "messages": 100,
      "playbook_fixes": 8,
      "lessons_active": 0,
      "lessons_applied": 0,
      "by_model": 0,
      "by_rules": 13,
      "by_lesson": 0
    },
    "groups": [
      {
        "id": "intake",
        "num": "01",
        "title": "Inbox & rules",
        "tagline": "Every inbound mail read, linked and routed - and every output checked against the customer's standing instructions.",
        "workers": [
          "inbox",
          "playbook"
        ]
      },
      {
        "id": "quotes",
        "num": "02",
        "title": "Quotes & rates",
        "tagline": "Rate lookups and drafted quotes on the lanes your carriers price.",
        "workers": [
          "rate",
          "rfq"
        ]
      },
      {
        "id": "bookings",
        "num": "03",
        "title": "Bookings & documents",
        "tagline": "Bookings opened on the record, and every document field where it belongs.",
        "workers": [
          "booking",
          "docs"
        ]
      },
      {
        "id": "shipments",
        "num": "04",
        "title": "Shipments & exceptions",
        "tagline": "Milestones on the booking, the exceptions nobody planned for, and the answers to what is on the board.",
        "workers": [
          "milestones",
          "exception",
          "assistant"
        ]
      },
      {
        "id": "billing",
        "num": "05",
        "title": "Billing & customs",
        "tagline": "Invoice reconciliation and entry checks against the discharge country.",
        "workers": [
          "invoice",
          "customs"
        ]
      }
    ],
    "workers": [
      {
        "id": "inbox",
        "name": "Inbox Worker",
        "mode": "live",
        "group": "intake",
        "summary": "13 mails read · 13 routed"
      },
      {
        "id": "playbook",
        "name": "Playbook Worker",
        "mode": "live",
        "group": "intake",
        "summary": "19 outputs checked · 8 sent back to be fixed"
      },
      {
        "id": "rate",
        "name": "Rate Worker",
        "mode": "live",
        "group": "quotes",
        "summary": "5 mails · 0 outputs"
      },
      {
        "id": "rfq",
        "name": "RFQ Worker",
        "mode": "live",
        "group": "quotes",
        "summary": "1 mail · 2 outputs"
      },
      {
        "id": "booking",
        "name": "Booking Worker",
        "mode": "live",
        "group": "bookings",
        "summary": "4 mails · 9 outputs"
      },
      {
        "id": "docs",
        "name": "Docs Worker",
        "mode": "live",
        "group": "bookings",
        "summary": "6 mails · 2 outputs"
      },
      {
        "id": "milestones",
        "name": "Milestones Worker",
        "mode": "live",
        "group": "shipments",
        "summary": "3 mails · 3 outputs"
      },
      {
        "id": "exception",
        "name": "Exception Worker",
        "mode": "live",
        "group": "shipments",
        "summary": "2 mails · 4 outputs"
      },
      {
        "id": "invoice",
        "name": "Invoice Worker",
        "mode": "live",
        "group": "billing",
        "summary": "1 mail · 2 outputs"
      },
      {
        "id": "customs",
        "name": "Customs Worker",
        "mode": "live",
        "group": "billing",
        "summary": "2 mails · 2 outputs"
      },
      {
        "id": "assistant",
        "name": "Assistant",
        "mode": "scripted",
        "group": "shipments",
        "summary": "scripted - replays authored data"
      }
    ],
    "items": [
      {
        "id": "IN-101",
        "sender_org": "Kempen Electronics NV",
        "subject": "Pricing request - Shenzhen to Antwerp, 3 x 40HC",
        "received": "212m ago",
        "intent_label": "Rate request",
        "decided_by": "rules",
        "linked_booking": null,
        "customer": "Kempen Electronics NV",
        "path": [
          "inbox",
          "rfq",
          "rate",
          "playbook"
        ],
        "needs_look": false
      },
      {
        "id": "IN-102",
        "sender_org": "Rheinwerk Maschinenbau GmbH",
        "subject": "Booking request - Shanghai to Rotterdam, 2 x 40HC machine parts",
        "received": "187m ago",
        "intent_label": "Booking request",
        "decided_by": "rules",
        "linked_booking": null,
        "customer": "Rheinwerk Maschinenbau GmbH",
        "path": [
          "inbox",
          "booking",
          "docs",
          "rate",
          "planner"
        ],
        "needs_look": true
      },
      {
        "id": "IN-103",
        "sender_org": "Bavaria Drivetrain GmbH",
        "subject": "Final documents for HLCU-2261188",
        "received": "164m ago",
        "intent_label": "Documents",
        "decided_by": "rules",
        "linked_booking": "SHP-001",
        "customer": "Bavaria Drivetrain GmbH",
        "path": [
          "inbox",
          "docs",
          "playbook",
          "exception"
        ],
        "needs_look": false
      },
      {
        "id": "IN-104",
        "sender_org": "Nordmed Pharma Logistik AG",
        "subject": "Re-quote Ningbo - Hamburg reefer before next month's booking",
        "received": "150m ago",
        "intent_label": "Booking request",
        "decided_by": "rules",
        "linked_booking": null,
        "customer": "Nordmed Pharma Logistik AG",
        "path": [
          "inbox",
          "booking",
          "docs",
          "rate",
          "playbook",
          "planner"
        ],
        "needs_look": false
      },
      {
        "id": "IN-105",
        "sender_org": "CMA CGM",
        "subject": "Rollover notice - CMDU-4410765",
        "received": "131m ago",
        "intent_label": "Carrier notice",
        "decided_by": "rules",
        "linked_booking": "SHP-003",
        "customer": "Wonen Direct B.V.",
        "path": [
          "inbox",
          "milestones",
          "playbook",
          "exception",
          "routing"
        ],
        "needs_look": false
      },
      {
        "id": "IN-106",
        "sender_org": "Kempen Electronics NV",
        "subject": "Where is MEDU-1774390?",
        "received": "118m ago",
        "intent_label": "Status request",
        "decided_by": "rules",
        "linked_booking": "SHP-004",
        "customer": "Kempen Electronics NV",
        "path": [
          "inbox",
          "milestones",
          "playbook"
        ],
        "needs_look": false
      },
      {
        "id": "IN-107",
        "sender_org": "Elbe Werkzeugbau GmbH",
        "subject": "B/L draft HLCU-2264903 for approval",
        "received": "96m ago",
        "intent_label": "Documents",
        "decided_by": "rules",
        "linked_booking": "SHP-005",
        "customer": "Elbe Werkzeugbau GmbH",
        "path": [
          "inbox",
          "docs",
          "playbook"
        ],
        "needs_look": true
      },
      {
        "id": "IN-108",
        "sender_org": "Nordmed Pharma Logistik AG",
        "subject": "Please book 1 x 40RH vaccines Ningbo to Hamburg",
        "received": "77m ago",
        "intent_label": "Booking request",
        "decided_by": "rules",
        "linked_booking": null,
        "customer": "Nordmed Pharma Logistik AG",
        "path": [
          "inbox",
          "booking",
          "docs",
          "rate",
          "playbook",
          "planner"
        ],
        "needs_look": true
      },
      {
        "id": "IN-109",
        "sender_org": "Elbe Werkzeugbau GmbH",
        "subject": "Re-quote Busan - Hamburg flatracks for the next booking",
        "received": "58m ago",
        "intent_label": "Booking request",
        "decided_by": "rules",
        "linked_booking": null,
        "customer": "Elbe Werkzeugbau GmbH",
        "path": [
          "inbox",
          "booking",
          "docs",
          "rate",
          "playbook",
          "planner"
        ],
        "needs_look": false
      },
      {
        "id": "IN-110",
        "sender_org": "Hapag-Lloyd",
        "subject": "Freight invoice HL-88213407 - HLCU-2264903",
        "received": "41m ago",
        "intent_label": "Carrier invoice",
        "decided_by": "rules",
        "linked_booking": "SHP-005",
        "customer": "Elbe Werkzeugbau GmbH",
        "path": [
          "inbox",
          "invoice",
          "playbook"
        ],
        "needs_look": false
      },
      {
        "id": "IN-111",
        "sender_org": "MSC",
        "subject": "Arrival notice - MEDU-2209471 at Fos-sur-Mer",
        "received": "30m ago",
        "intent_label": "Arrival notice",
        "decided_by": "rules",
        "linked_booking": "SHP-007",
        "customer": "Maison Cardelle SAS",
        "path": [
          "inbox",
          "customs"
        ],
        "needs_look": false
      },
      {
        "id": "IN-112",
        "sender_org": "CMA CGM",
        "subject": "Arrival notice - CMDU-5518824 at Rotterdam, onward to Basel",
        "received": "19m ago",
        "intent_label": "Arrival notice",
        "decided_by": "rules",
        "linked_booking": "SHP-006",
        "customer": "Rheintal Spezialchemie AG",
        "path": [
          "inbox",
          "customs"
        ],
        "needs_look": false
      },
      {
        "id": "IN-113",
        "sender_org": "Transhipment terminal",
        "subject": "Milestone: CMDU-5518824 departed transhipment port",
        "received": "6m ago",
        "intent_label": "Milestone",
        "decided_by": "rules",
        "linked_booking": "SHP-006",
        "customer": "Rheintal Spezialchemie AG",
        "path": [
          "inbox",
          "milestones"
        ],
        "needs_look": false
      }
    ],
    "messages_sample": [
      {
        "seq": 1,
        "from": "Inbox Worker",
        "to": "RFQ Worker",
        "kind": "handoff",
        "item": "IN-101",
        "text": "Rate request from Kempen Electronics NV. Customer: Kempen Electronics NV.",
        "why": "By rules - strongest cues: rate request (4 vs next 0). Routed to the RFQ Worker."
      },
      {
        "seq": 8,
        "from": "Inbox Worker",
        "to": "Booking Worker",
        "kind": "handoff",
        "item": "IN-108",
        "text": "Booking request from Nordmed Pharma Logistik AG. Customer: Nordmed Pharma Logistik AG.",
        "why": "By rules - strongest cues: booking request (6 vs next 1). Routed to the Booking Worker."
      },
      {
        "seq": 10,
        "from": "Inbox Worker",
        "to": "Invoice Worker",
        "kind": "handoff",
        "item": "IN-110",
        "text": "Carrier invoice from Hapag-Lloyd. Linked to SHP-005 (HLCU-2264903).",
        "why": "By rules - strongest cues: carrier invoice (3 vs next 1). Routed to the Invoice Worker."
      },
      {
        "seq": 14,
        "from": "RFQ Worker",
        "to": "Rate Worker",
        "kind": "query",
        "item": "IN-101",
        "text": "Price 3 x 40HC into Antwerp.",
        "why": null
      },
      {
        "seq": 15,
        "from": "Rate Worker",
        "to": "RFQ Worker",
        "kind": "reply",
        "item": "IN-101",
        "text": "7 options into Antwerp; best ONE on R-ANR-STD, EUR 2,380 per 40HC, 33 days.",
        "why": "Every carrier on a route into Antwerp, priced from the rate sheet and ranked: Cape routings last, then cheapest, then fastest."
      },
      {
        "seq": 16,
        "from": "RFQ Worker",
        "to": "Playbook Worker",
        "kind": "check",
        "item": "IN-101",
        "text": "Check IN-101-1 for Kempen Electronics NV.",
        "why": "Every output is checked against Kempen Electronics NV's 2 standing rule(s) before a person sees it."
      },
      {
        "seq": 17,
        "from": "Playbook Worker",
        "to": "RFQ Worker",
        "kind": "revise",
        "item": "IN-101",
        "text": "IN-101-1: quotes to this customer are valid 7 days, not 14.",
        "why": "Customer rule: Their planning cycle is weekly."
      },
      {
        "seq": 18,
        "from": "RFQ Worker",
        "to": "Playbook Worker",
        "kind": "revised",
        "item": "IN-101",
        "text": "IN-101-1: validity set to 7 days.",
        "why": "The Worker that made it fixes it - the Playbook Worker never edits another Worker's output."
      },
      {
        "seq": 19,
        "from": "Playbook Worker",
        "to": "RFQ Worker",
        "kind": "revise",
        "item": "IN-101",
        "text": "IN-101-1: copy logistics-planning@kempen-electronics.example on every mail to this customer.",
        "why": "Customer rule: Planning owns the unloading slots."
      },
      {
        "seq": 20,
        "from": "RFQ Worker",
        "to": "Playbook Worker",
        "kind": "revised",
        "item": "IN-101",
        "text": "IN-101-1: added logistics-planning@kempen-electronics.example in copy.",
        "why": "The Worker that made it fixes it - the Playbook Worker never edits another Worker's output."
      },
      {
        "seq": 21,
        "from": "Playbook Worker",
        "to": "RFQ Worker",
        "kind": "verdict",
        "item": "IN-101",
        "text": "IN-101-1: 2 of 2 rule(s) satisfied, 2 after a fix.",
        "why": "Re-checked after every fix, up to three rounds; anything still broken would have gone to a person."
      },
      {
        "seq": 22,
        "from": "RFQ Worker",
        "to": "Playbook Worker",
        "kind": "check",
        "item": "IN-101",
        "text": "Check IN-101-2 for Kempen Electronics NV.",
        "why": "Every output is checked against Kempen Electronics NV's 2 standing rule(s) before a person sees it."
      },
      {
        "seq": 23,
        "from": "Playbook Worker",
        "to": "RFQ Worker",
        "kind": "verdict",
        "item": "IN-101",
        "text": "IN-101-2: 1 of 1 rule(s) satisfied.",
        "why": "Re-checked after every fix, up to three rounds; anything still broken would have gone to a person."
      },
      {
        "seq": 58,
        "from": "Booking Worker",
        "to": "Docs Worker",
        "kind": "query",
        "item": "IN-108",
        "text": "Read the 1 attachment(s) on IN-108.",
        "why": null
      },
      {
        "seq": 59,
        "from": "Docs Worker",
        "to": "Booking Worker",
        "kind": "reply",
        "item": "IN-108",
        "text": "Read 7 fields from 1 document(s).",
        "why": "Fields read from “Label: value” lines the extractor knows; a label it does not know is reported, never guessed."
      },
      {
        "seq": 60,
        "from": "Booking Worker",
        "to": "Rate Worker",
        "kind": "query",
        "item": "IN-108",
        "text": "Price 1 x 40RH into Hamburg.",
        "why": null
      },
      {
        "seq": 61,
        "from": "Rate Worker",
        "to": "Booking Worker",
        "kind": "reply",
        "item": "IN-108",
        "text": "5 options into Hamburg; best ONE on R-HAM-STD, EUR 3,880 per 40RH, 32 days.",
        "why": "Every carrier on a route into Hamburg, priced from the rate sheet and ranked: Cape routings last, then cheapest, then fastest."
      },
      {
        "seq": 62,
        "from": "Booking Worker",
        "to": "Playbook Worker",
        "kind": "check",
        "item": "IN-108",
        "text": "Check IN-108-1 for Nordmed Pharma Logistik AG.",
        "why": "Every output is checked against Nordmed Pharma Logistik AG's 3 standing rule(s) before a person sees it."
      },
      {
        "seq": 63,
        "from": "Playbook Worker",
        "to": "Booking Worker",
        "kind": "revise",
        "item": "IN-108",
        "text": "IN-108-1: ONE is not an approved carrier - use Maersk or Hapag-Lloyd.",
        "why": "Customer rule: GDP-audited reefer carriers only - vaccines."
      },
      {
        "seq": 64,
        "from": "Booking Worker",
        "to": "Rate Worker",
        "kind": "query",
        "item": "IN-108",
        "text": "Price 1 x 40RH into Hamburg, only Maersk or Hapag-Lloyd.",
        "why": null
      },
      {
        "seq": 65,
        "from": "Rate Worker",
        "to": "Booking Worker",
        "kind": "reply",
        "item": "IN-108",
        "text": "4 options into Hamburg; best Hapag-Lloyd on R-HAM-STD, EUR 3,960 per 40RH, 32 days.",
        "why": "Every carrier on a route into Hamburg, priced from the rate sheet and ranked: Cape routings last, then cheapest, then fastest. Only Maersk or Hapag-Lloyd, as the playbook allows."
      },
      {
        "seq": 66,
        "from": "Booking Worker",
        "to": "Playbook Worker",
        "kind": "revised",
        "item": "IN-108",
        "text": "IN-108-1: rebooked with Hapag-Lloyd (EUR 3,960 per container).",
        "why": "The Worker that made it fixes it - the Playbook Worker never edits another Worker's output."
      },
      {
        "seq": 67,
        "from": "Playbook Worker",
        "to": "Booking Worker",
        "kind": "verdict",
        "item": "IN-108",
        "text": "IN-108-1: 1 of 1 rule(s) satisfied, 1 after a fix.",
        "why": "Re-checked after every fix, up to three rounds; anything still broken would have gone to a person."
      },
      {
        "seq": 68,
        "from": "Booking Worker",
        "to": "Playbook Worker",
        "kind": "check",
        "item": "IN-108",
        "text": "Check IN-108-2 for Nordmed Pharma Logistik AG.",
        "why": "Every output is checked against Nordmed Pharma Logistik AG's 3 standing rule(s) before a person sees it."
      },
      {
        "seq": 69,
        "from": "Playbook Worker",
        "to": "Booking Worker",
        "kind": "verdict",
        "item": "IN-108",
        "text": "IN-108-2: 1 of 1 rule(s) satisfied.",
        "why": "Re-checked after every fix, up to three rounds; anything still broken would have gone to a person."
      },
      {
        "seq": 70,
        "from": "Booking Worker",
        "to": "Playbook Worker",
        "kind": "check",
        "item": "IN-108",
        "text": "Check IN-108-3 for Nordmed Pharma Logistik AG.",
        "why": "Every output is checked against Nordmed Pharma Logistik AG's 3 standing rule(s) before a person sees it."
      },
      {
        "seq": 71,
        "from": "Playbook Worker",
        "to": "Booking Worker",
        "kind": "revise",
        "item": "IN-108",
        "text": "IN-108-3: copy qa-logistics@nordmed-pharma.example on every mail to this customer.",
        "why": "Customer rule: Quality assurance sees every shipment mail."
      },
      {
        "seq": 72,
        "from": "Booking Worker",
        "to": "Playbook Worker",
        "kind": "revised",
        "item": "IN-108",
        "text": "IN-108-3: added qa-logistics@nordmed-pharma.example in copy.",
        "why": "The Worker that made it fixes it - the Playbook Worker never edits another Worker's output."
      },
      {
        "seq": 73,
        "from": "Playbook Worker",
        "to": "Booking Worker",
        "kind": "verdict",
        "item": "IN-108",
        "text": "IN-108-3: 1 of 1 rule(s) satisfied, 1 after a fix.",
        "why": "Re-checked after every fix, up to three rounds; anything still broken would have gone to a person."
      },
      {
        "seq": 74,
        "from": "Booking Worker",
        "to": "Planner Worker",
        "kind": "handoff",
        "item": "IN-108",
        "text": "NEW-108 is new on the forward book - for the pre-departure sweep.",
        "why": null
      },
      {
        "seq": 85,
        "from": "Invoice Worker",
        "to": "Playbook Worker",
        "kind": "check",
        "item": "IN-110",
        "text": "Check IN-110-1 for Elbe Werkzeugbau GmbH.",
        "why": "Every output is checked against Elbe Werkzeugbau GmbH's 1 standing rule(s) before a person sees it."
      },
      {
        "seq": 86,
        "from": "Playbook Worker",
        "to": "Invoice Worker",
        "kind": "verdict",
        "item": "IN-110",
        "text": "IN-110-1: 1 of 1 rule(s) satisfied.",
        "why": "Re-checked after every fix, up to three rounds; anything still broken would have gone to a person."
      },
      {
        "seq": 87,
        "from": "Invoice Worker",
        "to": "Playbook Worker",
        "kind": "check",
        "item": "IN-110",
        "text": "Check IN-110-2 for Elbe Werkzeugbau GmbH.",
        "why": "Every output is checked against Elbe Werkzeugbau GmbH's 1 standing rule(s) before a person sees it."
      },
      {
        "seq": 88,
        "from": "Playbook Worker",
        "to": "Invoice Worker",
        "kind": "verdict",
        "item": "IN-110",
        "text": "IN-110-2: 1 of 1 rule(s) satisfied.",
        "why": "Re-checked after every fix, up to three rounds; anything still broken would have gone to a person."
      }
    ],
    "outputs_sample": [
      {
        "id": "IN-101-1",
        "item": "IN-101",
        "kind": "mail",
        "worker": "RFQ Worker",
        "subject": "Quote: Shenzhen to Antwerp, 3 x 40HC",
        "to": "p.claes@kempen-electronics.example",
        "booking_ref": "SHP-004",
        "status": "DRAFT - not sent",
        "approval_status": "awaiting_approval",
        "reason": "The top-ranked option on the rate sheet: ONE on R-ANR-STD, 33 days."
      },
      {
        "id": "IN-101-2",
        "item": "IN-101",
        "kind": "tms",
        "worker": "RFQ Worker",
        "subject": null,
        "to": null,
        "booking_ref": "Q-101",
        "status": "QUEUED - not written",
        "approval_status": "awaiting_approval",
        "reason": "Quote drafted for Kempen Electronics NV."
      },
      {
        "id": "IN-108-1",
        "item": "IN-108",
        "kind": "tms",
        "worker": "Booking Worker",
        "subject": null,
        "to": null,
        "booking_ref": "NEW-108",
        "status": "QUEUED - not written",
        "approval_status": "awaiting_approval",
        "reason": "MSC was asked for but does not price this lane on the rate sheet. Opened from the mail and 1 document(s). Carrier changed to Hapag-Lloyd under the customer's playbook."
      },
      {
        "id": "IN-108-2",
        "item": "IN-108",
        "kind": "mail",
        "worker": "Booking Worker",
        "subject": "Booking request NEW-108: Ningbo - Hamburg, 1 x 40RH",
        "to": "Booking desk, Hapag-Lloyd",
        "booking_ref": "NEW-108",
        "status": "DRAFT - not sent",
        "approval_status": "awaiting_approval",
        "reason": null
      },
      {
        "id": "IN-108-3",
        "item": "IN-108",
        "kind": "mail",
        "worker": "Booking Worker",
        "subject": "Booking NEW-108 received - Ningbo to Hamburg",
        "to": "a.petersen@nordmed-pharma.example",
        "booking_ref": "NEW-108",
        "status": "DRAFT - not sent",
        "approval_status": "awaiting_approval",
        "reason": null
      },
      {
        "id": "IN-110-1",
        "item": "IN-110",
        "kind": "tms",
        "worker": "Invoice Worker",
        "subject": null,
        "to": null,
        "booking_ref": "SHP-005",
        "status": "QUEUED - not written",
        "approval_status": "awaiting_approval",
        "reason": "1 of 3 lines differ from the agreed rate."
      },
      {
        "id": "IN-110-2",
        "item": "IN-110",
        "kind": "mail",
        "worker": "Invoice Worker",
        "subject": "Query on Freight invoice HL-88213407",
        "to": "billing@hlag.example",
        "booking_ref": "SHP-005",
        "status": "DRAFT - not sent",
        "approval_status": "awaiting_approval",
        "reason": "1 line not on the agreed rate - queried with the carrier, not passed for payment."
      }
    ],
    "escalations": [
      {
        "item": "IN-102",
        "from": "Booking Worker",
        "to": "A person",
        "text": "NEW-102 held: gross weight not found in the documents. Not guessed - asking the customer.",
        "why": "A booking goes to the carrier only when every required field was read from the documents."
      },
      {
        "item": "IN-104",
        "from": "Booking Worker",
        "to": "A person",
        "text": "NEW-104 held: commodity, hs code, incoterm, packages, gross weight not found in the documents. Not guessed - asking the customer.",
        "why": "A booking goes to the carrier only when every required field was read from the documents."
      },
      {
        "item": "IN-109",
        "from": "Booking Worker",
        "to": "A person",
        "text": "NEW-109 held: commodity, hs code, incoterm, packages, gross weight not found in the documents. Not guessed - asking the customer.",
        "why": "A booking goes to the carrier only when every required field was read from the documents."
      },
      {
        "item": "IN-112",
        "from": "Customs Worker",
        "to": "A person",
        "text": "SHP-006 lands at Rotterdam but is going to Basel (Switzerland): a transit out of the EU, not an import entry. Who declares it and under which guarantee is a person's call - nothing filed.",
        "why": "Basel is outside the EU customs union, so an import entry at Rotterdam would be the wrong filing."
      },
      {
        "item": "IN-105",
        "from": "Exception Worker",
        "to": "Routing Worker",
        "text": "SHP-003 now misses its required-by date by 4 days. Re-plan: the next routing decision is the Routing Worker's, and a person approves it.",
        "why": "7 days late against 3 days of slack - more than the desk can absorb."
      }
    ]
  }
} as const;
