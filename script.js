function searchIngred(foodItem) {
  $(".results").empty();
  var queryURL = "https://cors-anywhere.herokuapp.com/https://api.edamam.com/search?q=%22'" + foodItem + "'%22&app_id=3fde57c1&app_key=98ad8b6a80e961abf27f43122cbe422d"
  $.ajax({
      url: queryURL,
      method: "GET"
  })

      .then(function (response) {
          console.log(response)



          for (let index = 0; index < response.hits.length; index++) {
              var recipeTitle = response.hits[index].recipe.label;
              var recipeThumb = response.hits[index].recipe.image;
              var sourceLink = response.hits[index].recipe.url;
              console.log("DA TITLE " + recipeTitle)
              console.log("DA THUMBNAIL LINK " + recipeThumb)
              console.log("DIS BE DA SOURCE LINk " + sourceLink)
              publishInfo(recipeTitle, recipeThumb, sourceLink)
          }


      });
}



function publishInfo(recipeTitle, recipeThumb, sourceLink) {
  

  $("<div>").attr({
      'class': "recipeTitle",
      'id': recipeTitle.replace(/\s+/g, '') + "recipeTitle"
  }).appendTo(".results");
  $("<div>").attr({
    'class': "thumbnail",
    'id': recipeTitle.replace(/\s+/g, '') + "thumbnail"
}).appendTo(".results");
  $("<div>").attr({
      'class': "recipeLinks",
      'id': recipeTitle.replace(/\s+/g, '') + "recipeLinks"
  }).appendTo(".results");
  innerDivs(recipeTitle, sourceLink)
  innerImg(recipeTitle, recipeThumb)
}
function innerDivs(recipeTitle, sourceLink) {




  $("<a>").html("<id class='fab fas fa-carrot'></id>").attr({
      "href": sourceLink,
      "target": "_blank"
  }).appendTo("#" + recipeTitle.replace(/\s+/g, '') + "recipeLinks")
  if ($("#h5" + recipeTitle.replace(/\s+/g, '')).length) {
      return

  }
  $("<h5>").text(recipeTitle).attr("id", "h5" + recipeTitle.replace(/\s+/g, '')).appendTo("#" + recipeTitle.replace(/\s+/g, '') + "recipeTitle")


}
function innerImg(recipeTitle, recipeThumb) {
  if ($("#img" + recipeTitle.replace(/\s+/g, '')).length) {
      return
  }


  $("<img>").attr({
      'src': recipeThumb,
      'class': "thumbnailImg",
      'id': "img" + recipeTitle.replace(/\s+/g, '')
  }).appendTo("#" + recipeTitle.replace(/\s+/g, '') + "thumbnail")

}


var btncount = 0
$("#searchBtn").click(function () {
  if (btncount > 1) {
      return
  }
  ++btncount
  console.log(btncount)
  var ingredient = $("#searchBar").val().trim();
  $("#searchBar").val("");

  var newBtn = $("<button>");
  
  if ($("#ingredient1").length) {
      newBtn.attr("id", "ingredient2");
      newBtn.attr("class", "abtn")
      newBtn.text(ingredient);
      $(".ingredient2").append(newBtn);
      var twoIngreds = $("#ingredient1").text() + "," + ingredient
      searchIngred(twoIngreds)

      return
  }

  newBtn.attr("id", "ingredient1");
  newBtn.attr("class", "abtn")
  newBtn.text(ingredient);
  $(".ingredient1").append(newBtn);
  searchIngred(ingredient)

});


$(document).on('click', '.abtn', function (event) {
  --btncount
  $(this).remove()
  if ($(".abtn").length) {
      searchIngred($(".abtn").text())

  }
});



function getCoordintes() {
  var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
  };

  function success(pos) {
      var crd = pos.coords;
      var lat = crd.latitude.toString();
      var lng = crd.longitude.toString();
      var coordinates = [lat, lng];
      getCity(coordinates);
      return;
  }

  function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(coordinates) {
  var xhr = new XMLHttpRequest();
  var lat = coordinates[0];
  var lng = coordinates[1];

  xhr.open(
      "GET",
      "https://us1.locationiq.com/v1/reverse.php?key=pk.e87a2cda53fae1cd1bea780cbaa3ca5c&lat=" +
      lat +
      "&lon=" +
      lng +
      "&format=json",
      true
  );
  xhr.send();
  xhr.onreadystatechange = processRequest;
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          // console.log(response.lat)
          // console.log(response.lon)
          getGrocery(response.lat, response.lon)
          return;
      }
  }
}

$("#findGrocery").click(function () {
  getCoordintes()
});

function getGrocery(latitude, longitude) {
  window.open("https://www.google.com/maps/search/grocery+stores/@" + latitude + "," + longitude + ",12z/data=!4m4!2m3!5m1!2e1!6e6", '_blank')

}
