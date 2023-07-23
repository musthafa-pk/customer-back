
const { google } = require('googleapis');
const google_logout = (req,res)=>{
try {
console.log("hei");
    
} catch (error) {
    console.log("errr",error);
}

const client_id = "329439595652-i9nem31hldat1ipqle48brppcnftkuoc.apps.googleusercontent.com"
const client_secret = "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"
const redirect_uris = "http://localhost:3000/auth/google/callback"
const oauth2Client = new google.auth.OAuth2(
  client_id ,
  client_secret,
  redirect_uris
);

// Revoke the access token
function revokeToken(token) {
  return new Promise((resolve, reject) => {
    oauth2Client.revokeToken(token, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Usage example:
const accessToken = '...'; // Replace with the access token of the authenticated user
revokeToken(accessToken)
  .then(() => {
    console.log('Token revoked successfully');
  })
  .catch(err => {
    console.error('Error revoking token:', err);
  });


}


module.exports = {google_logout}