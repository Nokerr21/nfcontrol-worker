export function logBatchNumber(props) {
    var logElement = document.getElementById('logBatchNumber');
    var checkBox = document.getElementById("batchCheck");
    logElement.innerHTML = ""
    if(checkBox.checked == true){
      logElement.innerHTML += "<span style='font-family: Ubuntu, Arial, Helvetica, sans-serif; font-weight: bolder; font-size: 17.5px;'>Current Batch Number:</span>" + " " + props + '\n';
    }
    else{
      logElement.innerHTML = ""
    }
}