# Qure Healthcare Database Schema Documentation

## **Overview**

The Qure Healthcare system uses **MongoDB** with **Mongoose ODM** to manage healthcare queue management, appointments, and patient data. This document provides comprehensive schema documentation for all database models.

---

## **Database Architecture**

### **Core Collections (13 Models)**

1. **Users** - Patient and staff authentication
2. **Hospitals** - Healthcare facility information
3. **Queues** - Patient queue management
4. **WaitingRooms** - Physical waiting room tracking
5. **Appointments** - Scheduled medical appointments
6. **AccessCodes** - Staff authentication codes
7. **Departments** - Hospital departments
8. **Notifications** - System notifications
9. **Messages** - Patient-staff communication
10. **Feedback** - Patient feedback system
11. **Contacts** - Contact form submissions
12. **HospitalSettings** - Hospital configuration
13. **StaffActivity** - Staff activity tracking

---

## **1. User Schema**

**Collection**: `users`

### **Fields**

| Field                 | Type   | Required | Description                                            |
| --------------------- | ------ | -------- | ------------------------------------------------------ |
| `firstName`           | String | ✅       | Patient/staff first name                               |
| `lastName`            | String | ✅       | Patient/staff last name                                |
| `email`               | String | ✅       | Unique email address                                   |
| `phone`               | String | ✅       | Contact phone number                                   |
| `passwordHash`        | String | ✅       | Hashed password                                        |
| `role`                | String | ✅       | `"patient"` or `"staff"`                               |
| `hospitalName`        | String | ❌       | Hospital (staff only)                                  |
| `preferredHospital`   | String | ❌       | Patient's preferred hospital                           |
| `gender`              | String | ❌       | `"male"`, `"female"`, `"other"`, `"prefer-not-to-say"` |
| `dateOfBirth`         | Date   | ❌       | Patient's birth date                                   |
| `resetPasswordToken`  | String | ✅       | Password reset token                                   |
| `resetPasswordExpiry` | Date   | ❌       | Token expiration                                       |
| `createdAt`           | Date   | Auto     | Creation timestamp                                     |
| `updatedAt`           | Date   | Auto     | Last update timestamp                                  |

### **Indexes**

- `email` (unique)
- `role` + `hospitalName` (compound)

### **Business Rules**

- Email must be unique across all users
- Staff users must have `hospitalName`
- Password reset tokens expire after 10 minutes

---

## **2. Hospital Schema**

**Collection**: `hospitals`

### **Fields**

| Field       | Type    | Required | Description                   |
| ----------- | ------- | -------- | ----------------------------- |
| `name`      | String  | ✅       | Hospital name                 |
| `code`      | String  | ✅       | Unique hospital code          |
| `address`   | String  | ❌       | Physical address              |
| `phone`     | String  | ❌       | Contact phone                 |
| `isActive`  | Boolean | Auto     | Active status (default: true) |
| `createdAt` | Date    | Auto     | Creation timestamp            |
| `updatedAt` | Date    | Auto     | Last update timestamp         |

### **Indexes**

- `name` (unique)
- `code` (unique)

---

## **3. Queue Schema**

**Collection**: `queues`

### **Fields**

| Field               | Type     | Required | Description                                                     |
| ------------------- | -------- | -------- | --------------------------------------------------------------- |
| `patient`           | ObjectId | ✅       | Reference to User                                               |
| `hospitalName`      | String   | ✅       | Hospital name                                                   |
| `specialty`         | String   | ✅       | Medical specialty                                               |
| `queueNumber`       | String   | ✅       | Display queue number                                            |
| `position`          | Number   | ✅       | Position in queue                                               |
| `estimatedWaitTime` | Number   | ❌       | Wait time in minutes                                            |
| `status`            | String   | ✅       | `"waiting"`, `"called"`, `"served"`, `"cancelled"`, `"no_show"` |
| `joinedAt`          | Date     | Auto     | Join timestamp                                                  |
| `calledAt`          | Date     | ❌       | Called timestamp                                                |
| `servedAt`          | Date     | ❌       | Served timestamp                                                |
| `notes`             | String   | ❌       | Staff notes                                                     |
| `priority`          | String   | ❌       | `"low"`, `"medium"`, `"high"`, `"urgent"`                       |
| `assignedRoom`      | ObjectId | ❌       | Reference to WaitingRoom                                        |
| `createdAt`         | Date     | Auto     | Creation timestamp                                              |
| `updatedAt`         | Date     | Auto     | Last update timestamp                                           |

### **Indexes**

- `hospitalName` + `specialty` + `status` (compound)
- `patient` + `status` (compound)
- `position` + `status` (compound)

### **Business Rules**

- Position auto-increments per hospital/specialty
- Status transitions: waiting → called → served
- Priority affects queue position

---

## **4. WaitingRoom Schema**

**Collection**: `waitingrooms`

### **Fields**

| Field              | Type     | Required | Description                                          |
| ------------------ | -------- | -------- | ---------------------------------------------------- |
| `name`             | String   | ✅       | Room name                                            |
| `description`      | String   | ❌       | Room description                                     |
| `hospitalName`     | String   | ✅       | Hospital name                                        |
| `floor`            | String   | ❌       | Floor number                                         |
| `capacity`         | Number   | ✅       | Maximum capacity                                     |
| `currentOccupancy` | Number   | Auto     | Current patient count                                |
| `status`           | String   | Auto     | `"available"`, `"full"`, `"maintenance"`, `"closed"` |
| `color`            | String   | Auto     | `"green"`, `"yellow"`, `"orange"`, `"red"`           |
| `specialties`      | [String] | ❌       | Supported specialties                                |
| `lastUpdated`      | Date     | Auto     | Last occupancy update                                |
| `isActive`         | Boolean  | Auto     | Active status                                        |
| `createdAt`        | Date     | Auto     | Creation timestamp                                   |
| `updatedAt`        | Date     | Auto     | Last update timestamp                                |

### **Indexes**

- `hospitalName` + `isActive` (compound)
- `name` + `hospitalName` (unique compound)

### **Virtual Fields**

- `occupancyPercentage` - Calculated occupancy percentage

### **Methods**

- `updateOccupancy(newOccupancy)` - Update room occupancy
- `addPatient()` - Add patient to room
- `removePatient()` - Remove patient from room

### **Business Rules**

- Occupancy color changes based on percentage:
  - Green: 0-59%
  - Yellow: 60-79%
  - Orange: 80-99%
  - Red: 100%

---

## **5. Appointment Schema**

**Collection**: `appointments`

### **Fields**

| Field                   | Type     | Required | Description                           |
| ----------------------- | -------- | -------- | ------------------------------------- |
| `patient`               | ObjectId | ✅       | Reference to User                     |
| `doctor`                | String   | ✅       | Doctor name                           |
| `specialty`             | String   | ✅       | Medical specialty                     |
| `appointmentDate`       | Date     | ✅       | Appointment date                      |
| `appointmentTime`       | String   | ✅       | Time slot                             |
| `status`                | String   | ✅       | Appointment status                    |
| `notes`                 | String   | ❌       | Appointment notes                     |
| `hospitalName`          | String   | ❌       | Hospital name                         |
| `patientInfo`           | Object   | ✅       | Patient details snapshot              |
| `isRescheduled`         | Boolean  | Auto     | Reschedule flag                       |
| `originalAppointmentId` | ObjectId | ❌       | Original appointment (if rescheduled) |
| `reminderSent`          | Boolean  | Auto     | Reminder sent flag                    |
| `createdAt`             | Date     | Auto     | Creation timestamp                    |
| `updatedAt`             | Date     | Auto     | Last update timestamp                 |

### **Status Values**

- `"scheduled"` - Initial booking
- `"confirmed"` - Patient confirmed
- `"checked-in"` - Patient arrived
- `"in-progress"` - Currently being seen
- `"in-queue"` - Waiting for doctor
- `"completed"` - Appointment finished
- `"cancelled"` - Appointment cancelled
- `"rescheduled"` - Appointment rescheduled
- `"no-show"` - Patient didn't show

### **Indexes**

- `patient` + `appointmentDate` (compound)
- `status` + `appointmentDate` (compound)

---

## **6. AccessCode Schema**

**Collection**: `accesscodes`

### **Fields**

| Field          | Type     | Required | Description           |
| -------------- | -------- | -------- | --------------------- |
| `code`         | String   | ✅       | Unique access code    |
| `hospitalName` | String   | ✅       | Hospital name         |
| `permissions`  | [String] | ❌       | Staff permissions     |
| `createdBy`    | ObjectId | ✅       | Reference to User     |
| `isActive`     | Boolean  | Auto     | Active status         |
| `expiresAt`    | Date     | ❌       | Expiration date       |
| `usageCount`   | Number   | Auto     | Usage counter         |
| `lastUsedAt`   | Date     | Auto     | Last usage timestamp  |
| `description`  | String   | ❌       | Code description      |
| `createdAt`    | Date     | Auto     | Creation timestamp    |
| `updatedAt`    | Date     | Auto     | Last update timestamp |

### **Permissions**

- `"queue_management"` - Manage patient queues
- `"appointments"` - Manage appointments
- `"analytics"` - View analytics
- `"staff_management"` - Manage staff

### **Virtual Fields**

- `isExpired` - Check if code is expired
- `isValid` - Check if code is valid and active

### **Methods**

- `incrementUsage()` - Increment usage counter

---

## **7. Department Schema**

**Collection**: `departments`

### **Fields**

| Field              | Type     | Required | Description                |
| ------------------ | -------- | -------- | -------------------------- |
| `name`             | String   | ✅       | Department name            |
| `shortCode`        | String   | ✅       | Department code            |
| `status`           | String   | Auto     | `"active"` or `"inactive"` |
| `hospitalName`     | String   | ✅       | Hospital name              |
| `description`      | String   | ❌       | Department description     |
| `capacity`         | Number   | Auto     | Department capacity        |
| `currentOccupancy` | Number   | Auto     | Current occupancy          |
| `createdBy`        | ObjectId | ✅       | Reference to User          |
| `createdAt`        | Date     | Auto     | Creation timestamp         |
| `updatedAt`        | Date     | Auto     | Last update timestamp      |

### **Indexes**

- `hospitalName` + `shortCode` (unique compound)
- `hospitalName` + `status` (compound)

### **Virtual Fields**

- `occupancyPercentage` - Calculated occupancy percentage

---

## **8. Notification Schema**

**Collection**: `notifications`

### **Fields**

| Field            | Type     | Required | Description                               |
| ---------------- | -------- | -------- | ----------------------------------------- |
| `user`           | ObjectId | ✅       | Reference to User                         |
| `title`          | String   | ✅       | Notification title                        |
| `message`        | String   | ✅       | Notification message                      |
| `type`           | String   | ✅       | Notification type                         |
| `isRead`         | Boolean  | Auto     | Read status                               |
| `priority`       | String   | Auto     | `"low"`, `"medium"`, `"high"`, `"urgent"` |
| `relatedEntity`  | Object   | ❌       | Related entity info                       |
| `scheduledFor`   | Date     | ❌       | Scheduled delivery time                   |
| `sentAt`         | Date     | ❌       | Actual send time                          |
| `deliveryMethod` | [String] | Auto     | Delivery methods                          |
| `createdAt`      | Date     | Auto     | Creation timestamp                        |
| `updatedAt`      | Date     | Auto     | Last update timestamp                     |

### **Notification Types**

- `"queue_update"` - Queue status changes
- `"appointment_reminder"` - Appointment reminders
- `"appointment_confirmed"` - Appointment confirmations
- `"appointment_cancelled"` - Appointment cancellations
- `"general"` - General notifications

---

## **9. Message Schema**

**Collection**: `messages`

### **Fields**

| Field           | Type     | Required | Description                                                          |
| --------------- | -------- | -------- | -------------------------------------------------------------------- |
| `senderId`      | ObjectId | ✅       | Reference to User (sender)                                           |
| `receiverId`    | ObjectId | ✅       | Reference to User (receiver)                                         |
| `appointmentId` | ObjectId | ✅       | Reference to Appointment                                             |
| `message`       | String   | ✅       | Message content (max 1000 chars)                                     |
| `messageType`   | String   | Auto     | `"general"`, `"appointment_reminder"`, `"status_update"`, `"urgent"` |
| `priority`      | String   | Auto     | `"low"`, `"medium"`, `"high"`, `"urgent"`                            |
| `isRead`        | Boolean  | Auto     | Read status                                                          |
| `readAt`        | Date     | ❌       | Read timestamp                                                       |
| `hospitalName`  | String   | ✅       | Hospital context                                                     |
| `createdAt`     | Date     | Auto     | Creation timestamp                                                   |
| `updatedAt`     | Date     | Auto     | Last update timestamp                                                |

### **Indexes**

- `receiverId` + `createdAt` (compound)
- `appointmentId`
- `hospitalName`

---

## **10. Feedback Schema**

**Collection**: `feedbacks`

### **Fields**

| Field          | Type     | Required | Description                             |
| -------------- | -------- | -------- | --------------------------------------- |
| `patient`      | ObjectId | ✅       | Reference to User                       |
| `rating`       | Number   | ✅       | 1-5 star rating                         |
| `comments`     | String   | ✅       | Feedback text (10-500 chars)            |
| `visitType`    | String   | Auto     | `"appointment"`, `"queue"`, `"general"` |
| `doctorName`   | String   | ❌       | Doctor name                             |
| `specialty`    | String   | ❌       | Medical specialty                       |
| `hospitalName` | String   | ❌       | Hospital name                           |
| `visitDate`    | Date     | Auto     | Visit date                              |
| `status`       | String   | Auto     | `"pending"`, `"reviewed"`, `"resolved"` |
| `isAnonymous`  | Boolean  | Auto     | Anonymous flag                          |
| `createdAt`    | Date     | Auto     | Creation timestamp                      |
| `updatedAt`    | Date     | Auto     | Last update timestamp                   |

### **Indexes**

- `patient` + `createdAt` (compound)
- `rating`
- `status`

---

## **11. Contact Schema**

**Collection**: `contacts`

### **Fields**

| Field         | Type     | Required | Description                                        |
| ------------- | -------- | -------- | -------------------------------------------------- |
| `name`        | String   | ✅       | Contact name (2-100 chars)                         |
| `email`       | String   | ✅       | Contact email                                      |
| `message`     | String   | ✅       | Message content (10-1000 chars)                    |
| `subject`     | String   | ❌       | Message subject (max 200 chars)                    |
| `category`    | String   | Auto     | Auto-categorized message type                      |
| `status`      | String   | Auto     | `"new"`, `"in_progress"`, `"resolved"`, `"closed"` |
| `priority`    | String   | Auto     | `"low"`, `"medium"`, `"high"`, `"urgent"`          |
| `assignedTo`  | ObjectId | ❌       | Reference to User (assigned staff)                 |
| `response`    | String   | ❌       | Staff response (max 2000 chars)                    |
| `respondedAt` | Date     | ❌       | Response timestamp                                 |
| `respondedBy` | ObjectId | ❌       | Reference to User (responder)                      |
| `isRead`      | Boolean  | Auto     | Read status                                        |
| `readAt`      | Date     | ❌       | Read timestamp                                     |
| `readBy`      | ObjectId | ❌       | Reference to User (reader)                         |
| `tags`        | [String] | ❌       | Message tags                                       |
| `source`      | String   | Auto     | Message source                                     |
| `userAgent`   | String   | ❌       | Browser info                                       |
| `ipAddress`   | String   | ❌       | IP address                                         |
| `attachments` | [Object] | ❌       | File attachments                                   |
| `createdAt`   | Date     | Auto     | Creation timestamp                                 |
| `updatedAt`   | Date     | Auto     | Last update timestamp                              |

### **Auto-Categorization**

The system automatically categorizes messages based on keywords:

- **Complaint**: "complaint", "problem", "issue"
- **Support**: "support", "help", "assistance"
- **Feedback**: "feedback", "suggestion", "improve"
- **Partnership**: "partnership", "collaboration", "business"

---

## **12. HospitalSettings Schema**

**Collection**: `hospitalsettings`

### **Fields**

| Field                | Type     | Required | Description                  |
| -------------------- | -------- | -------- | ---------------------------- |
| `hospitalName`       | String   | ✅       | Hospital name (unique)       |
| `address`            | String   | ✅       | Hospital address             |
| `city`               | String   | ❌       | City                         |
| `state`              | String   | ❌       | State                        |
| `country`            | String   | Auto     | Country (default: "Nigeria") |
| `postalCode`         | String   | ❌       | Postal code                  |
| `phone`              | String   | ❌       | Contact phone                |
| `email`              | String   | ❌       | Contact email                |
| `website`            | String   | ❌       | Hospital website             |
| `logo`               | String   | ❌       | Logo URL/path                |
| `description`        | String   | ❌       | Hospital description         |
| `specialties`        | [String] | ❌       | Available specialties        |
| `operatingHours`     | Object   | ❌       | Weekly schedule              |
| `emergencyContact`   | Object   | ❌       | Emergency contact info       |
| `timezone`           | String   | Auto     | Timezone setting             |
| `capacityThresholds` | Object   | Auto     | Capacity limits              |
| `isActive`           | Boolean  | Auto     | Active status                |
| `createdBy`          | ObjectId | ✅       | Reference to User            |
| `createdAt`          | Date     | Auto     | Creation timestamp           |
| `updatedAt`          | Date     | Auto     | Last update timestamp        |

### **Operating Hours Structure**

```javascript
{
  monday: { open: "08:00", close: "17:00" },
  tuesday: { open: "08:00", close: "17:00" },
  // ... other days
}
```

---

## **13. StaffActivity Schema**

**Collection**: `staffactivities`

### **Fields**

| Field            | Type     | Required | Description                                     |
| ---------------- | -------- | -------- | ----------------------------------------------- |
| `staff`          | ObjectId | ✅       | Reference to User                               |
| `hospitalName`   | String   | ✅       | Hospital name                                   |
| `activity`       | String   | ✅       | `"login"`, `"logout"`, `"active"`, `"inactive"` |
| `ipAddress`      | String   | ❌       | IP address                                      |
| `userAgent`      | String   | ❌       | Browser info                                    |
| `location`       | String   | ❌       | Geographic location                             |
| `isActive`       | Boolean  | Auto     | Active status                                   |
| `lastActivityAt` | Date     | Auto     | Last activity timestamp                         |
| `createdAt`      | Date     | Auto     | Creation timestamp                              |
| `updatedAt`      | Date     | Auto     | Last update timestamp                           |

### **Indexes**

- `staff` + `hospitalName` (compound)
- `hospitalName` + `isActive` (compound)
- `lastActivityAt` (descending)

---

## **Relationships**

### **Primary Relationships**

```
User (1) ←→ (N) Queue
User (1) ←→ (N) Appointment
User (1) ←→ (N) Notification
User (1) ←→ (N) Message
User (1) ←→ (N) Feedback
User (1) ←→ (N) StaffActivity

Hospital (1) ←→ (N) User
Hospital (1) ←→ (N) Queue
Hospital (1) ←→ (N) WaitingRoom
Hospital (1) ←→ (N) Department

WaitingRoom (1) ←→ (N) Queue
AccessCode (1) ←→ (N) User

Appointment (1) ←→ (N) Message
```

### **Data Flow**

1. **Patient Registration** → User (patient role)
2. **Staff Registration** → User (staff role) + AccessCode
3. **Queue Joining** → Queue + WaitingRoom update
4. **Appointment Booking** → Appointment + Notification
5. **Staff Actions** → StaffActivity + Queue updates
6. **Patient Feedback** → Feedback + Notification

---

## 📊 **Performance Considerations**

### **Indexing Strategy**

- **Compound indexes** for multi-field queries
- **Unique indexes** for data integrity
- **Sparse indexes** for optional fields
- **TTL indexes** for time-based data cleanup

### **Query Optimization**

- Use `select()` to limit returned fields
- Use `lean()` for read-only queries
- Use `populate()` sparingly
- Implement pagination for large datasets

### **Data Archiving**

- Archive old appointments (>1 year)
- Archive completed queues
- Archive old notifications
- Archive resolved contacts

---

## 🔒 **Security & Validation**

### **Input Validation**

- Email format validation
- Phone number format validation
- Password strength requirements
- File upload restrictions

### **Data Protection**

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input sanitization

### **Audit Trail**

- Created/updated timestamps
- Staff activity tracking
- User action logging
- System change tracking

---

## **Deployment Notes**

### **Environment Variables**

```env
MONGODB_URI=mongodb://localhost:27017/qure-healthcare
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### **Database Initialization**

1. Create indexes after deployment
2. Set up database backups
3. Configure monitoring
4. Set up data retention policies

### **Monitoring**

- Database connection health
- Query performance metrics
- Index usage statistics
- Storage utilization

---

This schema supports a comprehensive healthcare queue management system with real-time updates, appointment scheduling, staff management, and patient communication features.
