const backend_url = 'http://localhost:3600'

export async function signIn(email, pass) {
    let response = await fetch(`${backend_url}/signIn`, {
        method: 'POST', 
        body: JSON.stringify({email, pass}),
        headers: {"Content-Type": "application/json"}
    })
    if (response.ok) {
        return response.json()
    }
    return null
}

export async function signUp(user) {
    let response = await fetch(`${backend_url}/signUp`, {
        method: 'POST', 
        body: JSON.stringify(user),
        headers: {"Content-Type": "application/json"}
    })
    if (response.ok) {
        return response.json()
    }
    return null
}

export async function getUser(id) {
    id = id || 'me'
    let response = await fetch(`${backend_url}/users/${id}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
    return response.json()
}

export async function deleteFriend(userId, friendId) {
    await fetch( `${backend_url}/users/${userId}/friends/${friendId}`, {method: 'DELETE', headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}})
}