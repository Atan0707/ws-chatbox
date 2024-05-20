import { useState, useEffect } from 'react'

function App() {

  const [qr, setQr] = useState('null');
  const [loading, setLoading] = useState(true);
  const [qrScanned, setQrScanned] = useState(false);
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');

  const endpoint = 'http://localhost:8081/qr'
  const sendMessage = 'http://localhost:8081/send-message'

  const handleClick = () => {
    fetch(sendMessage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId + '@c.us', // Replace with the recipient's phone number
        message: message,
      }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(alert('Message sent'))
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    const getData = async () => {
      const rawData = await fetch(endpoint);
      const dataJson = await rawData.json();
      if (dataJson.status) {
        setQrScanned(true);
      } else {
        setQr(dataJson);
      }
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div className="app">
      <h1>Whatsapp Chatbot</h1>
      {loading ? (
        <p>Loading...</p>
      ) : qrScanned ? (
        <p>User connected</p>
      ) : (
        <img src={qr.qrData} alt="QR Code" />
      )}
      <br />
      <form>
        <input type='text' value={chatId} onChange={e => setChatId(e.target.value)} placeholder='Enter phone number' />
        <input type='text' value={message} onChange={e => setMessage(e.target.value)} placeholder='Enter message' />
      </form>
      <button onClick={handleClick}>Send Message</button>
    </div>
  )
}

export default App