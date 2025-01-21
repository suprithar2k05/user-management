import { useEffect, useState } from "react"

export const useUserData = (url) => {
  const [users, setUsers] = useState([]);

  const getUserData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    const usersData = data.map(({id, name, email, company}) => {
      const [firstName, lastName] = name.split(' ');
      return {id, firstName, lastName, email, department: company.name}
    })
    setUsers(usersData);
  }

  useEffect(() => {
    getUserData();
  }, [])
  return [users, setUsers]
}