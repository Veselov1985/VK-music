/**
 * Created by Yurii on 16.08.2016.
 */
$(function () {
var id;
    var htmlout=$('#vk').html();
    console.log(htmlout);

    $("#acces").click(function () {
        if($(this).attr('disabled')) return;

        VK.Auth.login(function (response) {
            if (response.session) {
               id=response.session.mid;
                /* Пользователь успешно авторизовался */
                $('#acces').addClass("disabled");
                if( !($('#acces').next().is("p"))) $('#acces').after('<p>Congratulations you have given access to their data</p>');

            } else {
                /* Пользователь нажал кнопку Отмена в окне авторизации */

                $('#acces').attr('disabled',false);
                alert("you need to confirm your account ");
            }
        },65564);

    });



    $('#start').click( function () {

         if($(this).hasClass("disabled")) return;

        if(!id) {
            alert("you need to confirm your account ");
            return;
        }

         $(this).attr('disabled','disabled');
        VK.Api.call('users.get', {user_ids: id,fields:'photo_100,bdate,country,music,counters,city'}, function (r) {
            if (r.response) {
                getCity(r.response[0].city);
                $('#id_vk').val(id);
                $(".first_name_vk").text(r.response[0].first_name );
                $(".last_name_vk").text(r.response[0].last_name);
                $('.bdate').text(r.response[0].bdate);
                $('.img_vk').attr('src',r.response[0].photo_100);
                $('.music_pref').text("Musical preferences :"+r.response[0].music);
                $('.audio').text("audio recordings on the page :"+r.response[0].counters.audios);

            } else {

                $('#start').attr('disabled',false);
                alert('Error - Try latter');



            }
        });


    });






    $('#take_audios').click(function () {

      if( $('#take_audios').attr('disabled')) return;

        VK.Api.call('audio.get', {user_ids: id,count:1000}, function (data) {
            if (data.response) {
                var audioHTML='';
                for(var i=0;i<data.response.length;i++) {
                    audioHTML +="<div class='audio_cont'><div class='num col-sm-1'>"+(i+1)+".</div>";
                    audioHTML +="<div class='artist col-sm-4'>"+data.response[i].artist+"-"+data.response[i].title+"</div>";
                    audioHTML +="<div class='music col-sm-6'><audio src="+data.response[i].url+".mp3"+" controls preload='metadata'></audio></div><div class='col-sm-1'><a href="+data.response[i].url+ " download="+data.response[i].artist+"-"+data.response[i].title+".mp3><img src='https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSZwyZtquboi90KWcQsQCUqXu-Y0wKsqficcErTZ40IvhP7RIH_6Q'></a></div><div class='clearfix'></div></div>"

                }

                $('#content_vk .row').html(audioHTML);









                $('#take_audios').attr('disabled','disabled');
                $('#logout').slideDown(1000);

            }else {

                $('#take_audios').removeClass("disabled");

                alert("Error -Try Again");
            }
        });


    });


       $('#logout').click(function (e) {

          if(confirm("Doo you want Exit VK")) {
              VK.Auth.logout(function (r) {
                  document.location.reload();
              });

          } else {
              return;
              }

        
      });








         function getCity(val) {
             VK.Api.call( 'database.getCitiesById',{city_ids:val},function (r) {
                 if(r.response) {
                     $('.city').text("City :"+r.response[0].name);

                 }else {
                     $('.city').text("City :Not Found");

                 }

             })


         };






})










