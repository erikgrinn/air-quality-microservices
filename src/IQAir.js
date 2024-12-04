var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  async function fetchIQAir() {

    fetch("http://api.airvisual.com/v2/nearest_city?key=386c95d9-dadf-4028-8b72-14b94396bc2b", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result.data))
    .catch(error => console.log('error', error));
  }

// Call the async function
export {fetchIQAir}

