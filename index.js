(function () {
  //變數區
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const pagination = document.getElementById('pagination')
  const displayType = document.getElementById('displaytype')

  const ITEM_PER_PAGE = 24
  let paginationData = []
  let modelType = 'grid'
  let targetPage = '1'

  //API區
  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  //監聽事件區
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie, .card-title')) {
      console.log(event.target)
      console.log(event.target.parentElement.dataset.id)
      showUser(event.target.parentElement.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(user => user.name.match(regex))
    console.log(results)
    getPageData(1, results)
    getTotalPages(results)
  })

  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
      targetPage = event.target.dataset.page
    }
  })

  displayType.addEventListener('click', event => {
    if (event.target.classList.contains("fa-th")) {
      modelType = 'grid'
      console.log('grid')
    } else if (event.target.classList.contains("fa-bars")) {
      modelType = 'list'
      console.log('list')
    }
    getPageData(targetPage, paginationData)
  })

  //函式區
  function showUser(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = `${data.name} ${data.surname}`
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`
      modalDescription.innerHTML = ``
      let keys = Object.keys(data)
      let values = Object.values(data)
      for (let i = 0; i < keys.length - 2; i++) {
        modalDescription.innerHTML += `
        <li> ${keys[i]} : ${values[i]} </li>
        `
      }
    })
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    display(pageData)
  }

  function display(data) {
    if (modelType === 'grid') {
      displayDataList(data)
    } else if (modelType === 'list') {
      displayDataListBar(data)
    }
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
         <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-2">
          <div class="card mb-3" data-id="${item.id}">
            
            <img class="card-img-top btn-show-movie" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-movie-modal">
            <h6 class="card-title" data-toggle="modal" data-target="#show-movie-modal">${item.name} ${item.surname}</h6>
            <button class="btn btn-outline-secondary btn-add-favorite" data-id="${item.id}">+</button>

          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function displayDataListBar(data) {
    let htmlContent = `
        <ul class="list-group list-group-flush col-12">
          <li class="list-group-item d-flex justify-content-between align-items-center">        
          <h5 class='col-1'>Name</h5>
          <h5 class='col-1'>Gender</h5>
          <h5 class='col-1'>Age</h5>
          <h5 class='col-1'>Favorite</h5>
          </li>
        `
    data.forEach(function (item, index) {
      htmlContent += `
        <li class="list-group-item d-flex justify-content-between align-items-center">        
          <h6 class='col-2'>${item.name}</h6>
          <h6 class='col-2'>${item.gender}</h6>
          <h6 class='col-2'>${item.age}</h6>        
          <button class="btn btn-outline-secondary btn-add-favorite" data-id="${item.id}">+</button>
        </li>
      `
    })
    htmlContent += `</ul >`

    dataPanel.innerHTML = htmlContent
  }

  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
    const user = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${user.name} is already in your favorite list.`)
    } else {
      list.push(user)
      alert(`Added ${user.name} to your favorite list!`)
    }
    localStorage.setItem('favoriteUser', JSON.stringify(list))
  }

})()