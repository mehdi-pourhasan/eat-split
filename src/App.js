import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)


  function handleShowAtFriend() {
    setShowAddFriend(show => !show)
  }


  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend)
    setSelectedFriend((cur) =>
      cur?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))

    setSelectedFriend(null)
  }


  return <div className="app">
    <div className="sidebar">

      <FriendsList selectedFriend={selectedFriend} onSelection={handleSelection} friends={friends} />


      {showAddFriend && <FormAtFreind onAddFriend={handleAddFriend} />}


      <Button onClick={handleShowAtFriend} >
        {showAddFriend === true ? 'Close' : 'Add Friend'}
      </Button>

    </div>
    {selectedFriend && <FormSplitBill
      selectedFriend={selectedFriend}
      onsplitBill={handleSplitBill}
      key={selectedFriend.id}
    />}
  </div>
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return <ul>
    {friends.map(friend =>
      <Freind friend={friend} selectedFriend={selectedFriend} onSelection={onSelection} key={friend.id} />
    )}
  </ul>
}

function Freind({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id

  return <li className={isSelected ? 'selected' : ''}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>
    {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}€</p>}

    {friend.balance > 0 && <p className="green">Your friend owes you {Math.abs(friend.balance)}€</p>}

    {friend.balance === 0 && <p >You and your friend are even</p>}

    <Button onClick={e => onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
  </li>

}




function FormAtFreind({ onAddFriend }) {

  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')


  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !image) return

    const id = crypto.randomUUID()
    const newFreind = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }

    onAddFriend(newFreind)

    setName('')
    setImage('https://i.pravatar.cc/48')
  }


  return <form onSubmit={handleSubmit} className="form-add-friend">
    <label>🫂 Name</label>
    <input
      type="text"
      value={name}
      onChange={e => setName(e.target.value)} />
    <label >📷 URL</label>
    <input
      type="text"
      value={image}
      onChange={e => setImage(e.target.value)} />
    <Button>Add</Button>
  </form>
}

function FormSplitBill({ selectedFriend, onsplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')



  function handleSubmit(e) {
    e.preventDefault()

    if (!bill || !paidByUser) return

    onsplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)

  }


  return <form onSubmit={handleSubmit} className="form-split-bill">
    <h2>Split a bill with {selectedFriend.name}</h2>

    <label >💶Bill value</label>
    <input
      type="text"
      value={bill}
      onChange={e => setBill(+e.target.value)} />

    <label >💰 Your expense</label>
    <input
      type="text"
      value={paidByUser}
      onChange={e =>
        setPaidByUser
          (+e.target.value) > bill ? paidByUser :
          (+e.target.value)} />

    <label >💵 {selectedFriend.name}'s expense</label>
    <input type="text" disabled value={paidByFriend} />

    <label >🤑 who is paying the bill</label>
    <select
      value={whoIsPaying}
      onChange={e => setWhoIsPaying(e.target.value)}
    >
      <option value="user">You</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>

    <Button>Split bill</Button>
  </form>
}