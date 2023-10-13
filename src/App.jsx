import "./styles.css"
import { useEffect, useState } from "react"
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode"





export default function App(){
  const [message, setMessage] = useState("")
  const [scanResult, setScanResult] = useState("")
  const [scanTime, setScanTime] = useState("")
  const [scannerState, setScannerState] = useState("")
  const [newQR, setNewQR] = useState("")
  const [QRs, setQRs] = useState([])

  
  
  

  useEffect(() => {

   // Html5Qrcode.getCameras().then(devices => {
    //  if(devices && devices.length){
     //   var cameraId = devices[0].id;
        
     // }
    //})
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "readerQR", { fps: 5, qrbox: 250 });
    //console.log(html5QrcodeScanner.getState());

    
    
   // if (html5QrcodeScanner.getState() == "NOT_STARTED"){
   //   html5QrcodeScanner.render(onScanSuccess, onScanError);
    //}
    html5QrcodeScanner.render(onScanSuccess, onScanError);
    //setScannerState(html5QrcodeScanner.getState());
    //console.log(html5QrcodeScanner.getState());


    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
    var dateTime = date+' '+time;
          
    function onScanSuccess(decodedText, decodedResult) {
        // Handle on success condition with the decoded text or result.
        console.log(`Scan result: ${decodedText}`, decodedResult);
        setScanResult(decodedText);
        setScanTime(dateTime);
        consoleLogQR("Message: '" + decodedText + "' decoded!" + "\n" + "TimeStamp: " + dateTime);
        // ...
        html5QrcodeScanner.clear();
        // ^ this will stop the scanner (video feed) and clear the scan area.
    }

    function onScanError(err){
      console.warn(err)
    }
  }, [scanTime])


    function handleSubmit(e) {
        e.preventDefault()
    }

    function handleSubmitQRList(e) {
      e.preventDefault()
      if (newQR != ""){
        setQRs((currentQRs) => {
          return [... currentQRs, {id: crypto.randomUUID(), title: newQR, completed: false}, ]
        })
      }
  }

  function toggleQR(id, completed){
    setQRs(currentQRs => {
      return currentQRs.map(QR => {
        if(QR.id === id) {
          return { ...QR, completed}
        }
        return QR
      })
    })
  }

  function deleteQR(id){
    setQRs(currentQRs => {
      return currentQRs.filter(QR => QR.id !== id)
    })
  }



    async function readTag() {
        if ("NDEFReader" in window) {
          const ndef = new NDEFReader();
          try {
            //const ctrl = new AbortController();
            //ctrl.signal.onabort = event => {
            //};
            await ndef.scan();
            //document.querySelector("cancel").onClick = event => {
            //  ctrl.abort();
            //}
            ndef.onreading = event => {
              const decoder = new TextDecoder();
              for (const record of event.message.records) {
                //consoleLog("Record type:  " + record.recordType);
                //consoleLog("MIME type:    " + record.mediaType);
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
                var dateTime = date+' '+time;
                consoleLog("---- data ----\n" + decoder.decode(record.data) + "\n" + "TimeStamp: " + dateTime);
                
              }
            }
          } catch(error) {
            consoleLog(error);
          }
        } else {
          consoleLog("Web NFC is not supported.");
        }
      }

      
      
      async function writeTag(message) {
        if ("NDEFReader" in window) {
          const ndef = new NDEFReader();
          try {
            await ndef.write(message);
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
            var dateTime = date+' '+time;
            consoleLogWrite("Message: '" + message + "' written!" + "\n" + "TimeStamp: " + dateTime);
            setMessage("")
          } catch(error) {
            consoleLogWrite(error);
            setMessage("")
          }
        } else {
          consoleLogWrite("Web NFC is not supported.");
        }
      }
      
      function consoleLog(data) {
        var logElement = document.getElementById('log');
        logElement.innerHTML = ""
        logElement.innerHTML += data + '\n';
      }

      function consoleLogWrite(data) {
        var logElement = document.getElementById('logWrite');
        logElement.innerHTML = ""
        logElement.innerHTML += data + '\n';
      }

      function consoleLogQR(data) {
        var logElement = document.getElementById('logQR');
        logElement.innerHTML = ""
        logElement.innerHTML += data + '\n';
      }


    
    
    return (
        <>
        <form onSubmit={handleSubmitQRList} className="new-item-form">
            <nav className="nav">
              <label className="site-title">
                NFCONTROL
              </label>
              <ul>
                <a href="https://nokerr21.github.io/nfcontrol/">About</a>
              </ul>
            </nav>
            <div className="form-row">
                <label>READ NFC</label>
                <button onClick={() => readTag()} className="btn">READ</button>
                <pre id="log"></pre>
            </div>
            <div className="form-row">
              <label>READ QR CODE</label>
              <div id="readerQR"></div>
              <pre id="logQR"></pre>
              <button onClick={() => writeTag(scanResult)} className="btn">WRITE QR TO NFC</button>
              <pre id="logWrite"></pre>
            </div>
            <div className="form-row">
              <button id="buttonList" onClick={() => setNewQR(scanResult)} className="btn">ADD QR TO LIST</button>
            </div>
        </form>
        <h1 className="header">QR CODES LIST</h1>
        <ul className="list">
          {QRs.map(QR => {
            return (
            <li key={QR.id}>
              <label>
                <input type="checkbox" checked={QR.completed} onChange={e => toggleQR(QR.id, e.target.checked)} />
                {QR.title}
              </label>
              <button onClick={() => deleteQR(QR.id)} className="btn btn-danger">Delete</button>
              <button onClick={() => writeTag(QR.title)} className="btn">WRITE TO NFC</button>
          </li>
            )
          })}
          
        </ul>
        </>
    )
}