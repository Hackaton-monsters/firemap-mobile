# Business Requirements – Fire & Rescue Coordination App

## 1. Product Goal

A mobile application for real-time reporting and coordination of **fire** and **rescue** incidents via a map with incident markers and marker-based chats.

The app helps users and authorities quickly identify danger zones and coordinate response.

---

## 2. User Roles

### 2.1 Regular User (User)
- Can register and log in.
- Can see the map with fire/rescue markers.
- Can create new incident reports.
- Can view incident details.
- Can report fake/outdated incidents.
- Can join a marker chat and send messages.
- The **Chats** tab shows only chats that the user joined or created via their own reports.

### 2.2 Government User (Gov)
- Has all permissions of a Regular User.
- Additionally:
  - Sees **all** chats in the **Chats** tab (no join required).
  - Can delete reports (and optionally close/archive them).

---

## 3. Authentication and Registration

### 3.1 Registration
- Registration via login/password (minimum: email + password).
- Architecture must allow adding Google OAuth later.
- After successful registration:
  - User is automatically logged in.
  - User is redirected to the main screen (Map tab).

### 3.2 Login
- Login via email/login + password.
- Architecture must allow adding Google OAuth later.
- After successful login:
  - User is redirected to the main screen (Map tab).

### 3.3 Logout
- Available in **Settings**.
- After logout:
  - User is redirected to the login screen.
  - Local session/auth data is cleared.

---

## 4. Main Screen and Navigation

After authentication, the user sees a bottom tab bar with three tabs:

1. **Map**
2. **Chats**
3. **Settings**

Switching tabs must not affect authentication or session.

---

## 5. Map Tab

### 5.1 Map View
- The map displays markers representing incident reports.
- Marker types:
  - **fire**
  - **rescue**
- Only active (non-deleted/non-closed) reports are shown.

### 5.2 Tap on Existing Marker
When the user taps on an existing marker:

1. A **BottomSheet** opens containing:
   - Basic incident info (type, creation time, short description).
   - An action to open the **marker chat**.
   - An action to open **report details**.

2. From the BottomSheet, the user can:
   - Navigate to the **Chat** for that marker.
   - Navigate to **Report Details**.

---

## 6. Report Details

The report details screen (or section) must include:

- Incident type: **fire** / **rescue**.
- Creation time.
- Attached photos uploaded by users.
- User comments related to the report (not the chat messages).
- A **“Report”** action to flag:
  - Fake
  - Outdated
  - Other (with optional text)

### 6.1 Complaint Handling
- Complaints are stored and linked to:
  - The specific report.
  - The user who submitted the complaint.
- Future logic (e.g. auto-hide after a threshold, manual moderation) is out of scope but data must be stored to support it.

---

## 7. Marker Chat

### 7.1 Access to Chat
- Any user can open a marker chat from:
  - The marker BottomSheet.
  - The notice shown after creating a report.

### 7.2 Join Flow
- By default, the user can **view** the chat history but **cannot send messages**.
- The chat contains a **“Join”** button:
  - After tapping **Join**:
    - The user is allowed to send messages in this chat.
    - This chat appears in the user’s **Chats** tab.

---

## 8. Creating a New Report

### 8.1 Selecting a Point on the Map
- When the user taps on an empty area of the map (no marker in tap radius):
  - A temporary marker appears at that location.
  - A button **“Add”** is shown above the marker.

### 8.2 Opening the Report Creation Form
- When the user taps **“Add”**, a **BottomSheet** opens with a report creation form.

**Form fields:**
- Incident type:
  - **fire**
  - **rescue**
  (required)
- Comment (required or with minimal length).
- Photo attachments (optional).

### 8.3 Submitting the Report
After submitting:

1. The system creates a report and runs **merge logic** (for `fire` type; see Section 9).
2. The user sees a **notice**:

   - **Case A: New marker created**
     - Message indicating a new marker/report is created.
     - Button **“Open report”** → opens chat + report details.

   - **Case B: Report merged with existing one**
     - Message indicating the new report was merged with an existing marker.
     - Button **“Open report”** → opens chat/details for the merged marker.

3. When user opens the report from this flow:
   - They are taken into the same chat + details flow as when tapping an existing marker.
   - Business rule: the author of a report is **automatically joined** to that marker’s chat.
   - The chat must appear in their **Chats** tab.

---

## 9. Report Merge Logic (Fire Only)

Merging applies **only to reports of type `fire`**.

### 9.1 Merge Conditions
When a new **fire** report is created:

1. The system searches for existing **fire** reports within radius **N** (meters/km) from the selected point.
2. If there are **no** existing fire reports within radius N:
   - A **new marker** is created.
3. If there is **one or more** existing fire report(s) within radius N:
   - The new report is **linked/merged** with one of the existing fire markers (implementation detail is backend-specific).
   - The notice text must inform the user that their report has been merged with an existing marker.

### 9.2 Meaning of “Merged”
- On the map:
  - Only **one marker** is shown for the merged cluster (the base/target marker).
- In report details:
  - Either show a list of all reports inside this marker  
    **or**
  - Show an aggregated view (exact UX can be defined later).
- There is **one shared chat** for the merged marker.

### 9.3 Limitations
- **Rescue** reports are **never merged automatically**:
  - Every new rescue report creates a **separate marker**.

---

## 10. Chats Tab

### 10.1 Regular User View
- The **Chats** tab displays only:
  - Chats the user has **joined** (via the Join button).
  - Chats of reports created by the user (auto-join).

For each chat entry, display at minimum:
- Marker/incident identifier (e.g. type + approximate address or coordinates).
- Optional: unread messages badge.
- Optional: status (active/closed).

### 10.2 Government User View
- The **Chats** tab displays **all chats** for all reports.
- Gov user can open and write in any chat without joining.
- Optional future extension:
  - Highlight high-priority incidents.

---

## 11. Settings Tab

The **Settings** screen must contain:

### 11.1 Profile
- Nickname (editable).
- Email (editable with validation).
- Password change flow:
  - Old password.
  - New password.

### 11.2 Notifications
- A main toggle: **“Enable push notifications”** (on/off).
- Optional future settings:
  - Notifications for new messages in joined chats.
  - Notifications for new reports within a certain radius of the user’s current location.

### 11.3 Logout
- A **Logout** button that:
  - Clears user session/authentication.
  - Redirects to the login screen.

---

## 12. Government Report Management

### 12.1 Deleting a Report
- On the report details screen, Government users see a **“Delete report”** action.
- After deletion:
  - The report is no longer displayed on the map.
  - The related chat behavior must be defined as one of:
    - **Closed/read-only chat** with a “incident closed/removed” label.
    - **Fully inaccessible** chat (no access for regular users).
  - Exact behavior should be decided on product level, but the system must support at least one of these options.

---