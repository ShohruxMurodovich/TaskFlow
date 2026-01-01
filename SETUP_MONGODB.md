# ⚠️ IMPORTANT: MongoDB Setup Required

## Current Status

✅ **Fixed Issues:**
- TypeScript error in `nuxt.config.ts` - RESOLVED
- Missing `.env` files - CREATED

⚠️ **Action Required:**
- You need to set up MongoDB and update the connection string

## 🔧 Next Steps

### Option 1: MongoDB Atlas (Recommended - 5 minutes)

1. **Create Free MongoDB Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (free)

2. **Create Free Cluster**
   - Click "Create" → "Shared" (FREE)
   - Choose a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `taskuser`
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP**
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://taskuser:<password>@cluster0.xxxxx.mongodb.net/...`)

6. **Update backend/.env**
   - Open `backend/.env`
   - Replace the MONGODB_URI line with your connection string
   - Replace `<password>` with your actual password
   - Example:
   ```
   MONGODB_URI=mongodb+srv://taskuser:MyPass123@cluster0.abcd.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB (If already installed)

If you have MongoDB installed locally:

1. Start MongoDB service
2. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   ```

## 🚀 After Setting Up MongoDB

1. **Stop the running servers** (Press Ctrl+C in both terminal windows)

2. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `MongoDB Connected: cluster.mongodb.net`

3. **Restart Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open http://localhost:3000** in your browser

## 📝 Current Configuration Files

✅ **backend/.env** - Created (needs MongoDB URI update)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-for-development-only-change-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

✅ **frontend/.env** - Created and ready
```env
NUXT_PUBLIC_API_BASE=http://localhost:5000/api
```

## ❌ Common Errors & Solutions

**"MongooseServerSelectionError: connect ECONNREFUSED"**
- MongoDB connection string is wrong
- Check username/password
- Check IP whitelist in MongoDB Atlas

**"Authentication failed"**
- Wrong password in connection string
- Use URL-encoded password if it contains special characters

**"Network timeout"**
- IP not whitelisted in MongoDB Atlas
- Firewall blocking connection

## 🎯 Quick Test

After MongoDB is set up and servers restarted:
1. Go to http://localhost:3000
2. Click "Register here"
3. Create account with any email/password
4. You should be redirected to the dashboard!

Need help? Check the [QUICKSTART.md](./QUICKSTART.md) for more details.
