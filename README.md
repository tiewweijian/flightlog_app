## Flight Log Application

### Tech Stack
- Node.js 
- React (TailwindCSS, Windmill UI) 
- MongoDB 


### Instructions 

#### Web-Hosted 

1. You may view the demo of this website [here](https://tiewweijian.github.io/flightlog_app/)
2. The deployed application is supported by Github Pages, Google Cloud and MongoDB
3. Admin account has been created.
   - username: `admin`
   - password: `admin`

NOTE: The first few API calls might be slow as there is low traffic to backend, the backend might turn to idle.  


#### Local  (Backend)
1. Backend folder located in /backend 
2. In `.env` in the root folder of /backend, ensure that all database strings are changed to `localhost`
3. Run `npm i` to install all dependencies 
4. Run `npm start` 
5. To get an admin account, run `API_LINK/api/users/createAdmin` (only for development purposes)

#### Local (Frontend)
1. Frontend folder located in /frontend
2. Ensure backend API link is changed correctly to localhost `frontend/src/config/constants.js`
3. Run `npm i` to install dependencies. If you encounter any issue, run `npm i --legacy-peer-deps`
4. Run `npm run start`. If encounter issue, run `npm run start:legacy`


#### AOB
- Only `admin` account can delete other user accounts, and they cannot delete their own account.
- Other created accounts will not see admin controls. 

Any issues with running the application, feel free to contact me at tiewweijian@u.nus.edu. 
