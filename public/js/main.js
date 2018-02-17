String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

var mainElement = `<div class="Vote" id="rid">
  <div class="Vote-head">
    <button class="btn btn-delete" onclick="deleteRating(rid)">Delete</button>
    <h1>rtitle</h1>
  </div>
  <div class="Vote-body">
    <img src="rimage">
  </div>
  <div class="Vote-footer">
  <span id="rating-rid">
    rrating
    <p>Rating</p>
  </span>
    <div id="rateYo-rid"></div>
    <span id="voters-rid">
      rvoters
      <p>Voters</p>
    </span>
  </div>
  <script>
    $(()=> {
      $("#rateYo-rid").rateYo({
        starWidth: "25px",
        fullStar: true,
        rating: rrating,
        normalFill: "#e0e0e0",
        ratedFill: "#febe12",
        onSet: function(rating, rateYoInstance){
          rate(rid, rating)
        }
      })
    })
  </script>
</div>
`

$(()=>{
    function loadRatings() {
        $.ajax({
            url: '/ratings'
        }).done((ratings)=>{
            var container = $('.container')
            container.empty()
            ratings.reverse()
            ratings.forEach(xrating => {
              var newElement = $(mainElement
                                .replaceAll('rid', xrating.id)
                                .replaceAll('rrating', xrating.rating)
                                .replace('rimage', xrating.image)
                                .replace('rtitle', xrating.title)
                                .replace('rvoters', xrating.voters))
              newElement.appendTo(container)
            })
        }).fail(()=>{
            alert('Can not load ratings.')
        })
    }
    loadRatings()
})

function deleteRating(id){
  var xhr = new XMLHttpRequest()
  xhr.open('DELETE', '/delete/' + id, true)
  xhr.send()
  xhr.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      $.ajax({
          url: '/ratings'
      }).done((ratings)=>{
          var container = $('.container')
          container.empty()
          ratings.reverse()
          ratings.forEach(xrating => {
              var newElement = $(mainElement
                                .replaceAll('rid', xrating.id)
                                .replaceAll('rrating', xrating.rating)
                                .replace('rimage', xrating.image)
                                .replace('rtitle', xrating.title)
                                .replace('rvoters', xrating.voters))
              newElement.appendTo(container)
          })
      })
    }
  }
}

function rate(id, rating) {
  var xhr = new XMLHttpRequest()
  xhr.open('POST', '/vote/' + id, true)
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send('vote='+rating)
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("voters-" + id).innerHTML = JSON.parse(this.responseText).voters + '<p>Voters</p>';
      document.getElementById("rating-" + id).innerHTML = JSON.parse(this.responseText).rating + '<p>Rating</p>';
    }
  }
}
