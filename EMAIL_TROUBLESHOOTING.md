# Email Alert Troubleshooting Guide

## 🔍 **Issue Analysis**

Your email system is configured correctly, but emails aren't being delivered. Here are the most likely causes and solutions:

## ✅ **What's Working:**

- Email configuration is properly set up
- Environment variables are loaded correctly
- Nodemailer can connect to Gmail
- Notification system is storing data in database

## 🚨 **Root Causes & Solutions:**

### **1. Gmail App Password Issue (Most Likely)**

**Problem**: Gmail App Password might be incorrect or expired

**Solution**:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled
3. Generate a new App Password:
   - Go to "App passwords"
   - Select "Mail" and your device
   - Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
4. Update your `.env` file:
   ```
   EMAIL_PASS=your-new-16-character-app-password
   ```
5. Restart your server

### **2. Email Delivery Issues**

**Problem**: Emails are being sent but not received

**Solutions**:

- **Check Spam Folder**: Look in spam/junk folder
- **Check Gmail Filters**: Gmail might be filtering emails
- **Whitelist Domain**: Add your domain to Gmail contacts
- **Test with Different Email**: Try sending to a different email address

### **3. Appointment Timing Issue**

**Problem**: Cron job only sends reminders 1-2 hours before appointments

**Current Logic**:

- Only sends reminders for appointments 1-2 hours in the future
- Only for status: `"scheduled"` or `"confirmed"`
- Only for appointments where `reminderSent` is not `true`

**Solution**: Create test appointments with proper timing:

1. Create an appointment for 1.5 hours from now
2. Set status to `"scheduled"`
3. Ensure `reminderSent` is `false` or not set

### **4. Cron Job Not Running in Production**

**Problem**: Cron jobs might not work on your hosting platform

**Solutions**:

- **Check Hosting Support**: Verify your platform supports cron jobs
- **Alternative**: Use external cron services like:
  - [Cron-job.org](https://cron-job.org)
  - [EasyCron](https://www.easycron.com)
  - [SetCronJob](https://www.setcronjob.com)

### **5. Email Address Issues**

**Problem**: Patient email addresses might be incorrect

**Solution**: Verify patient emails in database:

```javascript
// Check if patient has valid email
const patient = await User.findById(appointment.patient);
if (!patient || !patient.email) {
  console.log(`No email found for patient ${appointment.patient}`);
  return;
}
```

## 🛠️ **Immediate Fixes:**

### **Fix 1: Update Gmail App Password**

1. Generate new App Password from Google Account
2. Update `.env` file with new password
3. Restart server

### **Fix 2: Test Email Sending**

Run this test to verify email works:

```bash
cd Backend
node test-email.js
```

### **Fix 3: Check Appointment Data**

Verify your test appointments have:

- Correct email addresses
- Status: `"scheduled"` or `"confirmed"`
- Timing: 1-2 hours in the future
- `reminderSent`: `false` or not set

### **Fix 4: Manual Email Test**

Create a test appointment and manually trigger reminder:

```javascript
// In your database or API
const appointment = await Appointment.findOne({...}).populate('patient');
await sendAppointmentReminder(appointment);
```

## 📋 **Debugging Steps:**

1. **Check Server Logs**: Look for cron job execution logs
2. **Verify Email Configuration**: Test with `test-email.js`
3. **Check Database**: Verify appointment data is correct
4. **Test Timing**: Create appointments with proper timing
5. **Check Spam**: Look in spam folder for emails

## 🚀 **Production Deployment:**

If using external hosting:

1. Ensure environment variables are set correctly
2. Verify cron job support
3. Consider using external cron service
4. Test email sending after deployment

## 📞 **Quick Test:**

1. Update Gmail App Password
2. Restart server
3. Create test appointment for 1.5 hours from now
4. Wait for next cron job execution (every 30 minutes)
5. Check email (including spam folder)

The most likely fix is updating your Gmail App Password!
