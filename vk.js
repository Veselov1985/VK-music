$(function () {

 var id;
 var $offset=0;
 var $count=50;
 var lostdata;
   $(".showafter").hide();


    
    

    $("#acces").click(function () {
        if($(this).attr('disabled')) return;

        VK.Auth.login(function (response) {
            if (response.session) {
               id=response.session.mid;
                /* Пользователь успешно авторизовался */
                $('#acces').addClass("disabled");
                if( !($('#acces').next().is("p"))) $('#acces').after('<p>Congratulations you have given access to their data</p>');
                  $("#vk").hide(2000);



        VK.Api.call('users.get', {user_ids: id,fields:'photo_200,bdate,country,music,counters,city'}, function (r) {
            if (r.response) {
                getCity(r.response[0].city);
                $('.id_vk').text("Your ID VK :"+id);
                $(".first_name_vk").text(r.response[0].first_name );
                $(".last_name_vk").text(r.response[0].last_name);
                $('.bdate').text("Date of Birth :"+r.response[0].bdate);
                $('.img_vk').attr('src',r.response[0].photo_200);
                $('.music_pref').text("Musical preferences :"+r.response[0].music);
                $('.audio').text("Audio recordings on the page :"+r.response[0].counters.audios);

            } else {
                    
                 $("#vk").show(2000);
               $('#acces').removeClass("disabled");



            }
        });

         
        
          VK.Api.call('audio.get', {user_ids: id,count:$count}, function (data) {
          
            if (data.response) {
                var audioHTML="<div class='audio_cont activeblock'>";
                for(var i=0;i<data.response.length;i++) {
                      audioHTML +="<div class='num col-sm-1'>"+(i+1)+".</div>";
                    audioHTML +="<div class='artist col-sm-4'>"+data.response[i].artist+"-"+data.response[i].title+"</div>";
                    audioHTML +="<div class='music col-sm-6'><audio src="+data.response[i].url+" controls preload='metadata'></audio></div><div class='col-sm-1'><a href='"+data.response[i].url+"' download='"+data.response[i].artist+"-"+data.response[i].title+".mp3'><i class='fa fa-file-audio-o  fa-2x'></i></a></div><div class='clearfix'></div>"

                }

               audioHTML+="</div>";
               $offset+= $count;
              
          
             
               $('#content_vk .row').html(audioHTML);
               
                $(".showafter").slideDown(2000);
                
              
            }else {

                alert("Error -Try Again");
                document.location.reload();

            }
        });



            } else {
                /* Пользователь нажал кнопку Отмена в окне авторизации */

                $('#acces').attr('disabled',false);
                alert("you need to confirm your account ");
                 document.location.reload();
            }
        },65564);

    });




     $( '.pager' ).on( 'click', 'a', function( event ) {
      var that=this;
    pagination(that,event);
 
});


function pagination(that,e) {
e.preventDefault();

 if($(that).attr('id')=='next') {
    if(lostdata && ($('div.activeblock').index()+1)==$('.audio_cont').size()) {     
     return;
    };

     if(lostdata && ($('div.activeblock').index()+1)!=$('.audio_cont').size()) {


     $('div.activeblock').removeClass('activeblock').hide().next().addClass('activeblock').show();
     $('.previous').removeClass('disabled');
      
      if(($('div.activeblock').index()+1)==$('.audio_cont').size()) {



         $('.next').addClass('disabled');
            return;

      }

      return;

     };

  


        VK.Api.call('audio.get', {user_ids: id,offset:$offset,count:$count}, function (data) {
             console.log(data);
            if (data.response) {

              if(data.response.length==0 ) {
               lostdata =true;
              $('.next').addClass('disabled');
               return;
            }
                var audioHTML="<div class='audio_cont'>";
                for(var i=0;i<data.response.length;i++) {
                      audioHTML +="<div class='num col-sm-1'>"+(i+1)+".</div>";
                    audioHTML +="<div class='artist col-sm-4'>"+data.response[i].artist+"-"+data.response[i].title+"</div>";
                    audioHTML +="<div class='music col-sm-6'><audio src="+data.response[i].url+" controls preload='metadata'></audio></div><div class='col-sm-1'><a href='"+data.response[i].url+"' download='"+data.response[i].artist+"-"+data.response[i].title+".mp3'><i class='fa fa-file-audio-o  fa-2x'></i></a></div><div class='clearfix'></div>"

                }

               audioHTML+="</div>";
              
             
               $('#content_vk .row').append(audioHTML);
             
               $('.previous').removeClass('disabled');
               
              
               $offset+= $count;
               console.log($('div.activeblock'));
               $('div.activeblock').removeClass('activeblock').hide().next().addClass('activeblock').show();
            
            } else {
                /* Пользователь нажал кнопку Отмена в окне авторизации */

                $('#acces').attr('disabled',false);
                alert("you need to confirm your account ");
                 document.location.reload();
            }
        },65564);

    


 } else if ($(that).attr('id')=='prev') {

 if( $('div.activeblock').index()==0) {
  

  return;

};



$('div.activeblock').removeClass('activeblock').hide().prev().addClass('activeblock').show();

if( $('div.activeblock').index()==0) {
   $('.previous').addClass('disabled');
return;

};


$('.next').removeClass('disabled');
    

 }


}



    

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





