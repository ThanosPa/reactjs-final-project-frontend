export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user: "+ JSON.stringify(user));

  if (user && user.token) {
    console.log("user1: "+ user.token);

    return { Authorization: "Bearer " + user.token };

    
  } else {
    return {};
  }
}
