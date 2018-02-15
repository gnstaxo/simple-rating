$(()=>{
    function loadRatings() {
        $.ajax({
            url: '/ratings'
        }).done((ratings)=>{
            var container = $('.container')
            container.empty()
            ratings.reverse()
            ratings.forEach(xrating => {
                var newElement = $(`
                  <div class="Vote" id="${xrating.id}">
                    <div class="Vote-head">
                      <button class="btn btn-delete" onclick="deleteRating(${xrating.id})">Delete</button>
                      <h1>${xrating.title}</h1>
                    </div>
                    <div class="Vote-body">
                      <img src="${xrating.image}">
                    </div>
                    <div class="Vote-footer">
                    <span id="rating-${xrating.id}">
                      ${xrating.rating}
                      <p>Rating</p>
                    </span>
                      <div id="rateYo-${xrating.id}"></div>
                      <span id="voters-${xrating.id}">
                        ${xrating.voters}
                        <p>Voters</p>
                      </span>
                    </div>
                    <script>
                      $(()=> {

                        $("#rateYo-${xrating.id}").rateYo({
                          starWidth: "25px",
                          fullStar: true,
                          rating: ${xrating.rating},
                          normalFill: "#e0e0e0",
                          ratedFill: "#febe12",
                          onSet: function(rating, rateYoInstance){
                            var xhr = new XMLHttpRequest()
                            xhr.open('POST', '/vote/${xrating.id}', true)
                            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            xhr.send('vote='+rating)
                            xhr.onreadystatechange = function() {
                              if (this.readyState == 4 && this.status == 200) {
                                document.getElementById("voters-${xrating.id}").innerHTML = JSON.parse(this.responseText).voters + '<p>Voters</p>';
                                document.getElementById("rating-${xrating.id}").innerHTML = JSON.parse(this.responseText).rating + '<p>Rating</p>';
                              }
                            }
                          }
                        })
                      })

                    </script>
                  </div>

                  `)
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
              var newElement = $(`
                <div class="Vote" id="${xrating.id}">
                  <div class="Vote-head">
                    <button class="btn btn-delete" onclick="deleteRating(${xrating.id})">Delete</button>
                    <h1>${xrating.title}</h1>
                  </div>
                  <div class="Vote-body">
                    <img src="${xrating.image}">
                  </div>
                  <div class="Vote-footer">
                  <span id="rating-${xrating.id}">
                    ${xrating.rating}
                    <p>Rating</p>
                  </span>
                    <div id="rateYo-${xrating.id}"></div>
                    <span id="voters-${xrating.id}">
                      ${xrating.voters}
                      <p>Voters</p>
                    </span>
                  </div>
                  <script>
                    $(()=> {

                      $("#rateYo-${xrating.id}").rateYo({
                        starWidth: "25px",
                        fullStar: true,
                        rating: ${xrating.rating},
                        normalFill: "#e0e0e0",
                        ratedFill: "#febe12",
                        onSet: function(rating, rateYoInstance){
                          var xhr = new XMLHttpRequest()
                          xhr.open('POST', '/vote/${xrating.id}', true)
                          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                          xhr.send('vote='+rating)
                          xhr.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                              document.getElementById("voters-${xrating.id}").innerHTML = JSON.parse(this.responseText).voters + '<p>Voters</p>';
                              document.getElementById("rating-${xrating.id}").innerHTML = JSON.parse(this.responseText).rating + '<p>Rating</p>';
                            }
                          }
                        }
                      })
                    })

                  </script>
                </div>

                `)
              newElement.appendTo(container)
          })
      })
    }
  }
}
