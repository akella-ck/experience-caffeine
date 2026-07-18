# Experience Caffeine for Business

## Product vision

Experience Caffeine for Business turns coffee knowledge into repeatable operating practice for cafés, roasters, training teams, equipment manufacturers, importers, and quality teams. It connects approved recipes, roast records, learning, equipment context, troubleshooting, and quality checks without presenting one technique or profile as universally correct.

The current release is a frontend demonstration. All organization records, telemetry, recipe changes, and integration states are mock data stored in code or local browser state. No coffee equipment is connected or controlled.

## Café use cases

- publish versioned espresso, filter, batch-brew, cold-brew, and beverage recipes;
- assign approved recipes to locations and equipment;
- record opening, shift-change, and closing calibration observations;
- track grinder settings without treating a dial number as universally portable;
- give baristas method lessons, checklists, and knowledge checks;
- diagnose cup-quality problems one primary variable at a time;
- compare recipe adherence and recurring quality issues across locations;
- document equipment cleaning, calibration, and maintenance context.

## Coffee-roaster use cases

- document green-coffee intake, density, moisture, process, and batch context;
- create, duplicate, compare, approve, revise, and archive roast profiles;
- annotate yellowing, first crack, drop, cooling, and operator observations;
- track roast color, weight loss, cupping results, and corrective actions;
- train staff in heat transfer, phase development, sensor limitations, and defects;
- link roast profiles to café and cupping recipes;
- review mock production records and quality-control exceptions;
- prepare for future read-only imports from supported roasting systems.

Roasting behavior varies with machine design, batch size, coffee density and moisture, processing method, ambient conditions, operator technique, and sensor placement. Profile values in this prototype are teaching examples, not machine instructions.

## Roast-profile workflow

1. Select the coffee and roasting machine context.
2. Record green-coffee measurements and intended roast style.
3. Establish a draft event sequence and operating notes.
4. Run the educational simulator or import a future read-only curve.
5. Record actual events, color, weight loss, and cupping observations.
6. Compare the revision with an approved reference.
7. Approve, revise, duplicate, or archive the profile with an audit trail.

In this release, edits remain local and revision history is illustrative. Production approval must require authenticated server-side permissions and durable audit records.

## Recipe-management workflow

1. Create a recipe by category and coffee.
2. Add equipment, location, ratio, temperature, timing, and quality targets.
3. Save as a draft and test it at the intended location.
4. Record staff notes and measured results.
5. Compare revisions and approve a controlled version.
6. Assign the approved version to locations and equipment.
7. Archive superseded versions without erasing their history.

The prototype performs these actions against local state. A production service should use optimistic concurrency, immutable revisions, approval permissions, and tenant-scoped persistence.

## Quality-control workflow

Quality control connects batch records, cupping, brew checks, deviations, and corrective actions:

1. Record a batch, cup, or location check.
2. Compare only meaningful values with an approved target or prior revision.
3. Flag deviations such as roast-color variance, weight-loss variance, recipe non-adherence, or repeat taste defects.
4. Assign one corrective action and an owner.
5. Re-measure after the change.
6. Close the alert with evidence or escalate it for review.

Dashboard metrics are directional mock examples. They are not certifications or universal quality thresholds.

## Troubleshooting workflow

The corporate diagnostic collects beverage, coffee, roast, grinder, recipe, water, equipment, location, shift, and recent-change context. It returns:

- a likely category;
- possible contributors;
- one recommended first check or adjustment;
- the reason for that action;
- the next measurement to collect;
- an inspection area and an escalation recommendation.

The result is intentionally probabilistic. Operators should change one primary variable, collect another observation, and escalate uncertain equipment or roast defects to a qualified person.

## Equipment-integration architecture

Roasting integrations live behind adapter contracts under `src/lib/integrations/roasters`:

- `types.ts` defines status, telemetry, commands, and adapter behavior;
- `base-adapter.ts` provides shared validation boundaries;
- `mock-roaster-adapter.ts` generates educational telemetry without controlling hardware;
- `registry.ts` resolves supported adapters without coupling UI code to a vendor.

Every real adapter will require vendor documentation, authentication, a documented connection protocol, input and command validation, explicit permissions, audit logs, local-network or gateway configuration, failure handling, and machine-specific safety review. Undocumented vendor endpoints must never be inferred or reverse-engineered into production control paths.

## Safety requirements for machine control

The current simulator never sends equipment commands. Any future control-capable integration for heat-producing machinery must include:

- explicit human confirmation at the moment of every consequential command;
- machine-specific ranges, interlocks, and state validation;
- separate read-only and control permissions;
- a visible connection and control-mode indicator;
- rate limits and duplicate-command protection;
- fail-safe behavior for lost connectivity or stale telemetry;
- local emergency-stop behavior independent of the cloud service;
- complete operator, command, acknowledgement, and outcome audit records;
- qualified operator training and vendor-approved installation;
- security review for local gateways and credential storage.

Software must never imply that a command succeeded based only on a local UI change. Confirmed device acknowledgement and a safe machine state are required.

## Future multi-tenant design

A production platform should model an organization as the tenant boundary. Organization membership, role, location access, recipes, profiles, telemetry, training, and quality records must be tenant-scoped at the database and API layers.

Recommended foundations:

- server-side authentication with short-lived, rotated sessions;
- role and permission checks on every protected server operation;
- database row-level security as defense in depth;
- immutable organization and resource identifiers;
- location-scoped permissions for managers and operators;
- separate approval permissions for roast, recipe, and quality workflows;
- audit logging for authentication, exports, approvals, commands, and role changes;
- encrypted secrets and integration credentials;
- retention, export, deletion, and legal-hold policies;
- tenant-isolation tests and operational monitoring.

The client-side role gates in this demonstration improve product flow only. They are not a production security boundary.
