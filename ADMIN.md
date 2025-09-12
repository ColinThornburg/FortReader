# FortReader Admin Guide

This document provides comprehensive instructions for admin access and management of the FortReader application.

## 🔐 Admin Access

### Initial Admin Account Setup

1. **Create Admin Account**:
   - Use the credentials from `admin-credentials.env` (not committed to git)
   - Email: `admin@fortreader.com`
   - Password: `AdminPassword123!`
   - Username: `admin` (case-sensitive)

2. **First Login**:
   - Go to https://fortreader-97219.web.app
   - Click "Sign Up" if no account exists
   - Use the admin credentials above
   - The system will automatically detect `admin` username and grant admin privileges

3. **Change Default Password**:
   - After first login, change the password in Firebase Console
   - Go to Firebase Console > Authentication > Users
   - Find the admin user and reset password
   - Update `admin-credentials.env` with new password

### Admin Privileges

Admins have access to:
- **User Management**: View and edit all user data
- **Skin Management**: Add/edit/delete admin skins
- **Reading Points**: Adjust user points
- **Reading Time**: Modify total reading time
- **Generations**: Reset daily generation limits
- **Daily Goals**: Change user reading goals

## 🛠️ Admin Panel Features

### User Management

Access the admin panel by:
1. Log in with admin credentials
2. Click the admin panel button (red shield icon)
3. Click "Manage Users" in the User Management section

#### User Data You Can Edit:

- **Reading Points**: Adjust user's RP balance
- **Total Reading Time**: Modify total validated reading time (in seconds)
- **Generations Today**: Reset daily skin generation count
- **Daily Goal**: Change user's daily reading goal (in minutes)

#### User Management Interface:

- **User List**: Table showing all registered users
- **Search/Filter**: Find specific users quickly
- **Edit Modal**: Click "Edit" to modify user data
- **Real-time Updates**: Changes save immediately to Firebase

### Skin Management

#### Admin Skins:
- **Add Skins**: Upload custom skins to the shop
- **Edit Skins**: Modify existing skin properties
- **Delete Skins**: Remove skins from the shop
- **Set Rarity**: Choose skin rarity (Common, Rare, Epic, Legendary, Custom)
- **Set Cost**: Define RP cost for skins
- **Toggle Active**: Enable/disable skins in shop

#### Skin Upload:
- **File Upload**: Upload PNG/JPG images (max 2MB)
- **URL Upload**: Use external image URLs
- **Auto-resize**: Images automatically optimized
- **Firebase Storage**: Images stored securely in Firebase

## 🔧 Technical Details

### Database Structure

**Users Collection** (`/users/{uid}`):
```json
{
  "username": "string",
  "readingPoints": "number",
  "totalTimeRead": "number (seconds)",
  "ownedSkins": "array",
  "equippedSkinId": "string",
  "isAdmin": "boolean",
  "skinGenerationData": {
    "generationsToday": "number",
    "lastGenerationTime": "timestamp",
    "dailyResetTime": "timestamp",
    "readingTimeUsedForGeneration": "number"
  },
  "readingStats": {
    "dailyGoalMinutes": "number",
    "todayValidatedTime": "number",
    "lastReadingDate": "string",
    "readingSessions": "array"
  }
}
```

**Admin Skins Collection** (`/adminSkins/{skinId}`):
```json
{
  "name": "string",
  "description": "string",
  "rarity": "enum",
  "cost": "number",
  "imageUrl": "string",
  "isActive": "boolean",
  "createdAt": "timestamp"
}
```

### Firebase Security Rules

**Firestore Rules**:
- Users can only read/write their own data
- Admins can read/write all user data
- Admin skins are readable by all, writable by authenticated users

**Storage Rules**:
- Admin skins: readable by all, writable by authenticated users
- Generated skins: readable by all, writable by authenticated users
- User content: private to each user

## 🚨 Security Considerations

### Credential Management

1. **Never commit admin credentials** to version control
2. **Use strong passwords** for admin accounts
3. **Rotate passwords regularly**
4. **Limit admin access** to trusted personnel only
5. **Monitor admin actions** through Firebase logs

### Best Practices

1. **Backup user data** before making bulk changes
2. **Test changes** on a development environment first
3. **Document changes** made to user accounts
4. **Use descriptive usernames** for admin accounts
5. **Log out** after admin sessions

## 📊 Monitoring and Analytics

### Firebase Console Access

1. **Go to**: https://console.firebase.google.com/project/fortreader-97219
2. **Authentication**: View user accounts and login activity
3. **Firestore**: Browse user data and admin skins
4. **Storage**: Manage uploaded images
5. **Analytics**: View app usage statistics

### Key Metrics to Monitor

- **User Registration**: New user signups
- **Reading Activity**: Daily reading time trends
- **Skin Generation**: AI skin creation usage
- **Admin Actions**: User data modifications
- **Error Rates**: Failed operations and crashes

## 🆘 Troubleshooting

### Common Issues

1. **Admin Panel Not Showing**:
   - Ensure username is exactly "admin" (case-sensitive)
   - Check Firebase authentication status
   - Verify user has `isAdmin: true` in database

2. **User Data Not Updating**:
   - Check Firebase connection
   - Verify user UID exists
   - Check Firebase security rules
   - Look for console errors

3. **Skin Upload Fails**:
   - Check file size (max 2MB)
   - Verify file format (PNG/JPG)
   - Check Firebase Storage rules
   - Ensure user is authenticated

4. **Permission Denied**:
   - Verify admin status in database
   - Check Firebase security rules
   - Ensure user is logged in
   - Try refreshing the page

### Debug Steps

1. **Check Browser Console** for error messages
2. **Verify Firebase Connection** in Network tab
3. **Check User Permissions** in Firebase Console
4. **Test with Different Browser** or incognito mode
5. **Clear Browser Cache** and try again

## 📞 Support

### Getting Help

1. **Check this documentation** first
2. **Review Firebase Console** logs
3. **Check browser console** for errors
4. **Test in different browser** or device
5. **Contact development team** with specific error messages

### Emergency Procedures

1. **User Data Corruption**:
   - Restore from Firebase backup
   - Manually fix affected records
   - Notify affected users

2. **Admin Access Lost**:
   - Use Firebase Console to reset password
   - Check user permissions in database
   - Verify admin flag is set correctly

3. **System Outage**:
   - Check Firebase status page
   - Verify domain configuration
   - Check for deployment issues

---

**Last Updated**: September 12, 2025  
**Version**: 1.0  
**Maintained By**: Development Team

## 🔗 Quick Links

- **Live App**: https://fortreader-97219.web.app
- **Firebase Console**: https://console.firebase.google.com/project/fortreader-97219
- **GitHub Repository**: https://github.com/ColinThornburg/FortReader
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
