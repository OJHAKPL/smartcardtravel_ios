	//window.webservice_url = "http://192.168.1.16/projects/laravel/smartcardTravel/admin/";
	window.webservice_url = "https://www.smartcardtravel.com/admin/";
	
	
	$(document).on('pagebeforecreate', '[data-role="page"]', function() {
		//checkConnection();
	});
	
	$('#login').live('pageinit', function(e) { checkPreAuth(); });
	$("#roleManagement").submit(function() {
		homeLogin();
	});
	
	
	function checkPreAuth() {
		user_id = window.localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			$.mobile.changePage("#login",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
		} else {
			cardlist();
		}
	
	}
	function checkConnection() {
        var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
		if(states[networkState]=='Unknown connection' || states[networkState]=='No network connection') {
			showAlert('Connection error: ' + states[networkState]);
		}
    }

	function loading(showOrHide, delay) {
		setTimeout(function() {
			$.mobile.loading(showOrHide);
		}, delay);
	}

	
	function pushNotify() {
		//alert('push');
		var push = PushNotification.init({ 
		 "android": 
		 {"senderID": "48866309941"}
          } );

		push.on('registration', function(data) {
			var loginid='';
			if (localStorage.getItem('userid')){
				loginid = localStorage.getItem('userid-travel');
			} else{
				loginid = localStorage.getItem('userid-travel-2');
			} 
			//alert ('tocken id'+data.registrationId);
            // send data.registrationId to push service
			$.post(
				webservice_url+'web-device-tocken',
				{
					tocken_id: data.registrationId, //'adjadkdjkalskjsaaldkSAJKLD',
					user_id: loginid
				},
					function(data,status){
					var dataArray = jQuery.parseJSON(data);
					var htmlStr='';
					$.each(dataArray, function(i, field){
						//alert('field'+field);			
					});					
				}
			);
        }); 


        push.on('notification', function(data) {
            // do something with the push data
            // then call finish to let the OS know we are done
			showAlert(data.message);
			//alert(data.title);
			//alert(data.count);
			//alert(data.sound);
			//alert(data.image);
			//alert(data.additionalData);
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData
			//alert(data.registrationId+'here');
            push.finish(function() {
				//alert("processing of push data is finished");
            });
        }); 
		
		push.on('error', function(e) {
			showAlert(e.message+ 'error');
			//console.log(e.message);
		});
		
	}	 
	
 
	
	
	function navigationOpen(){ 
		$( ".jqm-navmenu-panel ul" ).listview();
		$.mobile.activePage.find('.menu-new').panel("open") ;
	}
	
	/*--------- Login -----------*/  
	function homeLogin() {
		
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-login',
			beforeSend: function(){
				$('.loader_login').show();
			},
			complete: function(){
				$('.loader_login').hide();
			},
			data: {  email: $("#login-email").val(), password: $("#login-password").val() },
			dataType: 'html',
			success: function(logindata){
				
				var dataArray = jQuery.parseJSON(logindata);
				var htmlStr='';
				$.each(dataArray, function(i, field){
					if(field.email){
						if($('#keep_me_login').is(":checked")) {
							localStorage.setItem('email-travel', field.email);
							localStorage.setItem('userid-travel', field.id);
						} else {
							localStorage.setItem('userid-travel-2', field.id);
						}
						pushNotify();
						cardlist();
					} else {
						if(dataArray.error){
							showAlert(dataArray.error);
						}		
					}					
				});
			}
		});
	} 
	
	
	/*--------- Card List-----------*/
	
	function cardlist() {
		
		$.mobile.changePage("#card-list",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
	 	user_id = localStorage.getItem('userid-travel');
	 	if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id){
			
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-card-list',
				beforeSend: function(){
					$('.loader_cardlist').show();
				},
				complete: function(){
					$('.loader_cardlist').hide();
				},
				data: { "user_id": user_id },
				success: function(cardlist){ 
				
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$(".dashboard-link-arrow").show();
						$('.cardslistHtml').html(cardlistArr.success);
					} else {
						$(".dashboard-link-arrow").hide();
						msgerror = (cardlistArr.error)?cardlistArr.error:'';
						msgerror = '<span class="no-record-card-list">'+msgerror+'</span>';
						$('.cardslistHtml').html(msgerror);
					}
				},
				dataType: 'html'
			});
		} 
	} 	
	
	
	
	/*--------- Basic Card List-----------*/
	function basicCardList() { 
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id){
			
			$.mobile.changePage("#basic-card-list",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-basic-card-list',
				beforeSend: function(){
					$('.loader_basiccardlist').show();
				},
				complete: function(){
					$('.loader_basiccardlist').hide();
				},
				data: { "user_id": user_id },
				success: function(cardlist){
					
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$('.basiccardslistHtml').html(cardlistArr.success);
					} else {
						msgerror = (cardlistArr.error)?cardlistArr.error:'';
						msgerror = '<span class="no-record-card">'+msgerror+'</span>';
						$('.basiccardslistHtml').html(msgerror);
					}
				},
				dataType: 'html'
			}); 
		} 
	} 
	
	
	
	function viewProfile(){
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id){
			
			$.mobile.changePage("#view-profile",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-user-info',
				beforeSend: function(){
					$('.loader_user_view').show();
				},
				complete: function(){
					$('.loader_user_view').hide();
				},
				data: { "id": user_id },
				success: function(profiledetails){
					$('.viewprofileremove').remove();
					var profileArr = jQuery.parseJSON(profiledetails);
					if(!profileArr.error) {
						$('.ViewProfileHtml').html(profileArr.success);
					} else {
						$(".errorMsgShow").show();
						$(".errorMsgShow").removeClass("success");
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(profileArr.error);
						setTimeout(function() {
							$('.errorMsgShow').hide();
						}, 4000);
					}
				},
				dataType: 'html'
			});
		}  
	}
	
	
	function editProfile(id){
		
		$.mobile.changePage("#edit-profile",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-update-profile',
			beforeSend: function(){
				$('.loader_user_edit').show();
			},
			complete: function(){
				$('.loader_user_edit').hide();
			},
			data: { "id": id },
			success: function(profiledetails){
				
				var profileArr = jQuery.parseJSON(profiledetails);
				if(!profileArr.error) {
					$('.EditProfileHtml').html(profileArr.success);
					$(".EditProfileHtml").trigger("create");
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("success");
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(profileArr.error);
					setTimeout(function() {
						$('.errorMsgShow').hide();
					}, 4000);	
				}
			},
			dataType: 'html'
		});
	}
	
	
	/*-------- User Upload Images -----------*/
	
	var pictureSource;   // picture source
	var destinationType; // sets the format of returned value

	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
	    pictureSource   = navigator.camera.PictureSourceType;
	    destinationType = navigator.camera.DestinationType;
	}

	function clearCache() {
	    navigator.camera.cleanup();
	} 


	var sPicData; //store image data for image upload functionality

	function capturePhoto(){
	    navigator.camera.getPicture(picOnSuccess, picOnFailure, {
	                                quality: 20,
	                                destinationType: destinationType.FILE_URI,
	                                sourceType: pictureSource.CAMERA,
	                                correctOrientation: true
	                                });
	}

	function getPhoto(){
	    navigator.camera.getPicture(picOnSuccess, picOnFailure, {
	        quality: 20,
	        destinationType: destinationType.FILE_URI,
	        sourceType: pictureSource.SAVEDPHOTOALBUM,
	        correctOrientation: true
	    });
	}

	function picOnSuccess(imageData){

	    var image = document.getElementById('cameraPic');
	    image.src = imageData;
	    sPicData  = imageData; //store image data in a variable
		userId = $('#user_id').val();
		photoUpload(userId);
	}

	function picOnFailure(message){
		showAlert('Image not uploaded because: ' + message);
	}

	// ----- upload image ------------
	function photoUpload(userId) {
	    var options = new FileUploadOptions();
	    options.fileKey = "file";
	    options.fileName = sPicData.substr(sPicData.lastIndexOf('/') + 1);
	    options.mimeType = "image/jpeg";
	    options.chunkedMode = false;

	    var params = new Object();
	    params.fileKey = "file";
	    options.params = {}; // eig = params, if we need to send parameters to the server request
	    ft = new FileTransfer();
	    ft.upload(sPicData, webservice_url+"user-photo/"+userId, win, fail, options);
	}
	

	function win(r){
		/*------------ Images upload -----------*/
		//message = (r.response)?r.response:'';
		//showAlert(message);
	   
	    //alert(r.responseCode);
	    //alert(r.bytesSent);
	    //alert("User image uploaded scuccesfuly");
	}

	function fail(error){
		message = "An error has occurred: Code = "+ error.code
		showAlert(message);
	}
	
	
	function EditProfileSubmit(){
		
		/*--------- Edit Profile -----------*/  
		$('#editprofile').validate({
			rules: {
				first_name: {
					required: true
				},
				email: {
					required: true,
					email: true
				},
				phone: {
					required: true,
					number: true , minlength: 10 , maxlength: 10
				},
				mobile: {
					number: true , minlength: 10 , maxlength: 10
				}
			},
			messages: {
				first_name: {
					required: "Please enter your first name."
				},
				email: {
					required: "Please enter your email."
				},
				phone: {
					required: "Please enter your phone."
				},
				mobile: {
					
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {
				
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-update-profile-submit',
					beforeSend: function(){
						$('.loader_useredit').show();
					},
					complete: function(){
						$('.loader_useredit').hide();
					},
					data : $('#editprofile').serialize(),
					success: function(updateProfile){ 
						var dataMsg = jQuery.parseJSON(updateProfile);	
						if(dataMsg.error){
							showAlert(dataMsg.error);
						}
						if(dataMsg.success){
							showAlert(dataMsg.success);
							viewProfile();
						}
					},
					dataType: 'html'
				});
			}
		});
	}
	
	
	
	
	/*----------- card details ----------*/
	function editCard(cardId){
		
		//alert('edit card'); 
		$.mobile.changePage("#update-card",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
		
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-update-card/'+cardId+'',
			beforeSend: function(){
				$('.loader_cardupdate').show();
			},
			complete: function(){
				$('.loader_cardupdate').hide();
			},
			success: function(get_data){
				var getData = jQuery.parseJSON(get_data);
				if(!getData.error) {
					$('.updateCardHtml').html(getData.success);
					$(".updateCardHtml").trigger("create");
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("success");
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(getData.error);
					setTimeout(function() {
						$('.errorMsgShow').hide();
					}, 4000);	
				}
			},
			dataType: 'html'
		});	
	}
	
	
	/*--------- Edit Card Submit -----------*/  

	function EditCardSubmit() {
		
		$('#editcard').validate({
			rules: {
				first_name: {
					required: true
				},
				last_name: {
					required: true
				},
				email: {
					required: true
				},
				phone: {
					required: true
				}
			},
			messages: {
				first_name: {
					required: "Please enter first name."
				},
				last_name: {
					required: "Please enter last name."
				},
				email: {
					required: "Please enter email."
				},
				phone: {
					required: "Please enter phone."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {
				var push_response = pushConfirm();
				card_id = jQuery('#editcard').find('input[name="id"]').val();
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-update-card/'+card_id+'/'+push_response,
					beforeSend: function(){
						$('.loader_useredit').show();
					},
					complete: function(){
						$('.loader_useredit').hide();
					},
					data : $('#editcard').serialize(),
					success: function(updateCard){ 
						var dataMsg = jQuery.parseJSON(updateCard);	
						if(dataMsg.error){
							showAlert(dataMsg.error);
						}
						if(dataMsg.success){
							showAlert(dataMsg.success);
							cartDetails(card_id);
						}
					},
					dataType: 'html'
				}); 
			}
		});
	}	
	
	
	
	
	/*--------- Card Link-----------*/
	function cardLink(cardId){ 
	
		$.mobile.changePage("#card-link",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-link-card',
			beforeSend: function(){
				$('.loader_cardlinklist').show();
			},
			complete: function(){
				$('.loader_cardlinklist').hide();
			},
			data: { "card_id": cardId },
			success: function(cardlink){
				
				var get_data = jQuery.parseJSON(cardlink);
				if(!get_data.error) { 
					$('.updateCardLink').html(get_data.success);
					$(".updateCardLink").trigger("create");
				} else {
					$(".errorMsgShow").removeClass("success");
					$(".errorMsgShow").show();
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(get_data.error);
					setTimeout(function() {
						$('.errorMsgShow').hide();
					}, 4000);
				}
			},
			dataType: 'html'
		}); 
	}
	
	
	
	function addCardLink(){
		
		add_cardval = $('#add_cardval').val();
		if(add_cardval==0){
			var add_cardval = $('.count-iconlist').length;
			add_cardval++;
			$('#add_cardval').val(add_cardval);	
			add_cardval = $('#add_cardval').val();	
		} else {
			add_cardval = $('#add_cardval').val();
			add_cardval++;			
			$('#add_cardval').val(add_cardval);	
		}
		
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-add-link',
			beforeSend: function(){
				$('.loader_cardlinklist').show();
			},
			complete: function(){
				$('.loader_cardlinklist').hide();
			},
			data: { "link_id": add_cardval },
			success: function(data){
				var get_data = jQuery.parseJSON(data);
				if(get_data) { 
					$('#put_new_html').before(get_data);
					$(".updateCardLink").trigger("create");
				} 
			},
			dataType: 'html'
		});
	}	
	
	
	/*--------------- Form Submit Card Link --------------*/
	function cardLinkSubmit() {
		var card_id = $('#id').val();
		$('#editcard_link').validate({
			rules: {
				id: {
					required: true
				}
			},
			messages: {
				id: {
					required: "Card id is null."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {
				var push_response = pushConfirm();
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-update-link/'+push_response,
					beforeSend: function(){
						$('.loader_cardlinklist').show();
					},
					complete: function(){
						$('.loader_cardlinklist').hide();
					},
					data : $('#editcard_link').serialize(),
					success: function(updateCard) {
						var dataMsg = jQuery.parseJSON(updateCard);	
						if(dataMsg.error){
							showAlert(dataMsg.error);
						}
						if(dataMsg.success){
							showAlert(dataMsg.success);
							cartDetails(card_id);
						}
					},
					dataType: 'html'
				});
			}
		});
	}  	
	
	
	function deleteCardLink(cardlinkId){
		$('.removelink_'+cardlinkId).remove();
	}
	
	function onBackKeyDown() {
		history.go(-1);
	}
	
	


	
	
	
	/*--------- Edit Scroller -----------*/
	function editscroller(cardId){ 
	
		$.mobile.changePage("#card-scroller",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-scroller-card',
			beforeSend: function(){
				$('.loader_cardscroller').show();
			},
			complete: function(){
				$('.loader_cardscroller').hide();
			},
			data: { "card_id": cardId },
			success: function(data){
				var cardscrollerArr = jQuery.parseJSON(data);
				if(!cardscrollerArr.error) { 
					$('.updateCardScroller').html(cardscrollerArr.success);
					$(".updateCardScroller").trigger("create");
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("success");
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(cardscrollerArr.error);
					setTimeout(function() {
						$('.errorMsgShow').hide();
					}, 4000);
				}
			},
			dataType: 'html'
		});
	}
	
	
	function addCardScroller(){
		
		add_scroller = $('#add_scroller').val();
		if(add_scroller==0){
			var add_scroller = $('.count-iconlist-scroll').length;
			add_scroller++;
			$('#add_scroller').val(add_scroller);	
			add_scroller = $('#add_scroller').val();	
		} else {
			add_scroller = $('#add_scroller').val();
			add_scroller++;			
			$('#add_scroller').val(add_scroller);	
		}
		
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-add-scroller',
			beforeSend: function(){
				$('.loader_cardscroller').show();
			},
			complete: function(){
				$('.loader_cardscroller').hide();
			},
			data: { "scroller_id": add_scroller },
			success: function(data){
				var get_data = jQuery.parseJSON(data);
				if(get_data) { 
					$('#put_new_scroller_html').before(get_data);
					$(".updateCardScroller").trigger("create");
				} 
			},
			dataType: 'html'
		});
	}
	
	
	/*--------------- Form Submit Card Scroller --------------*/
	function cardScrollerSubmit() {
		
		$('#editcard_scroller').validate({
			rules: {
				id: {
					required: true
				}
			},
			messages: {
				id: {
					required: "Card id is null."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {
				var push_response = pushConfirm();
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-update-scroller/'+push_response,
					beforeSend: function(){
						$('.loader_cardscroller').show();
					},
					complete: function(){
						$('.loader_cardscroller').hide();
					},
					data : $('#editcard_scroller').serialize(),
					success: function(data_get){ 
						var dataMsg = jQuery.parseJSON(data_get);	
						if(dataMsg.error){
							$('.loader_cardscroller').hide();
							showAlert(dataMsg.error);
						}
						if(dataMsg.success){
							$('.loader_cardscroller').hide();
							showAlert(dataMsg.success);
							cartDetails(card_id);
						}
					},
					dataType: 'html'
				});
			}
		});
	} 
	
	
	function deleteCardScroller(cardscrollerId){
		$('.removescroller_'+cardscrollerId).remove();
	} 
	
	
	
	/*--------- Card Template List-----------*/
	function editTemplate(card_id) {
		
		$.mobile.changePage("#card-templates-list",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-card-template-list',
			beforeSend: function(){
				$('.loader_basiccardtemplates').show();
			},
			complete: function(){
				$('.loader_basiccardtemplates').hide();
			},
			data: { "card_id": card_id },
			success: function(cardlist){
				
				var cardlistArr = jQuery.parseJSON(cardlist);
				if(!cardlistArr.error) {
					$('.basiccardstemplatesHtml').html(cardlistArr.success);
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("success");
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(cardlistArr.error);
					setTimeout(function() {
						$('.errorMsgShow').hide();
					}, 4000);
				}
			},
			dataType: 'html'
		});
	} 	
	
	
	
	function templateApply(card_id,template_id){
		
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-update-template',
			beforeSend: function(){
				$('.loader_basiccardtemplates').show();
			},
			complete: function(){
				$('.loader_basiccardtemplates').hide();
			},
			data: { "card_id": card_id, "template_id": template_id },
			success: function(data_get){ 
			
				var dataMsg = jQuery.parseJSON(data_get);	
				if(dataMsg.error){
					showAlert(dataMsg.error);
				}
				if(dataMsg.success){
					showAlert(dataMsg.success);
					cartDetails(card_id);
				}
			},
			dataType: 'html'
		});
	}
	
	
	
	/*----------- card details ----------*/
	function cartDetails(cardId) {
		
		$('.cardDetails').show();
		$.mobile.changePage("#card-details",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-cards-detail',
			beforeSend: function(){
				$('.loader_carddetails').show();
			},
			complete: function(){
				$('.loader_carddetails').hide();
			},
			data: { "id": cardId },
			success: function(get_data){
				var datahtml = jQuery.parseJSON(get_data);
				if(!datahtml.error) {
					$('.CarddetailHtml').html(datahtml.success);
				} else {
					$(".errorMsgShow").show();
					$(".errorMsgShow").removeClass("success");
					$(".errorMsgShow").addClass("error");
					$(".errorMsgShow").text(datahtml.error);
					setTimeout(function() {
						$('.errorMsgShow').hide();
					}, 4000);
				}
			},
			dataType: 'html'
		});
	}
	
	
	
	/*------------- Change Password -------------*/
	
	function changePassword(){
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		} 
		
		$('#changepassword_form').validate({
			rules: {
				current_password: {
					required: true, minlength: 6
				},
				new_password: {
					required: true, minlength: 6
				},
				password_confirmation: {
					required: true, equalTo: "#new_password", minlength: 6
				},
			},
			messages: {
				current_password: {
					required: "Please enter your current password."
				},
				new_password: {
					required: "Please enter your new password."
				},
				password_confirmation: {
					required: "Please enter your confirm password."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {	
		
				user_id = localStorage.getItem('userid-travel');
				if(user_id==null || user_id==''){
					user_id = localStorage.getItem('userid-travel-2');
				}
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-cahnge-password/'+user_id,
					beforeSend: function(){
						$('.loader_changepass').show();
					},
					complete: function(){
						$('.loader_changepass').hide();
					},
					data : $('#changepassword_form').serialize(),
					success: function(passwordData){ 
						var dataMsg = jQuery.parseJSON(passwordData);
						if(dataMsg.error){
							showAlert(dataMsg.error);
						}
						if(dataMsg.success){
							$("#changepassword_form").trigger('reset');
							showAlert(dataMsg.success);
						}
					},
					dataType: 'html'
				});
			}
		});	 
	}


	/*--------- Shared Card List-----------*/
	function myfolderList(){
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id){
			$.mobile.changePage("#my-folderlist",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			$('.myfolderloader').show();
			if(localStorage.getItem('email-travel')) {
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-show-folders',
					beforeSend: function(){
						$('.loader_folderlist').show();
					},
					complete: function(){
						$('.loader_folderlist').hide();
					},
					data: { "user_id": user_id },
					success: function(folderlist){
						
						$('.folder_listadd').empty();
						var folderlistArr = jQuery.parseJSON(folderlist);
						if(folderlistArr.success){	
							$('.folder_listadd').html(folderlistArr.success);
							$('.myfolderloader').hide();
						} else {
							$('.myfolderloader').hide();
						}
					},
					dataType: 'html'
				});
			}
		} 
	}
	
	
	
	/*------------- Add New Folder -------------*/
	
	function addNewFolder(){
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		} 
		
		$('#save_folder_form').validate({
			rules: {
				folder_name: {
					required: true
				},
			},
			messages: {
				folder_name: {
					required: "The folder name is required."
				} 
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {	
		
				user_id = localStorage.getItem('userid-travel');
				if(user_id==null || user_id==''){
					user_id = localStorage.getItem('userid-travel-2');
				}
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-create-folder/'+user_id,
					beforeSend: function(){
						$('.loader_folderlist').show();
					},
					complete: function(){
						$('.loader_folderlist').hide();
					},
					data : $('#save_folder_form').serialize(),
					success: function(passwordData){ 
						var dataMsg = jQuery.parseJSON(passwordData);
						if(dataMsg.error){
							showAlert(dataMsg.error);
						}
						if(dataMsg.success){
							$("#folder_name").val('');
							showAlert(dataMsg.success);
							myfolderList();
						}
					},
					dataType: 'html'
				});
			}
		});	 
	}
	
	
	
	/*---------- Display cards in folder ----------*/
	function showFoldercards(folder_id) {
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id){
			
			$.mobile.changePage("#basic-card-list",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-basic-card-list',
				beforeSend: function(){
					$('.loader_basiccardlist').show();
				},
				complete: function(){
					$('.loader_basiccardlist').hide();
				},
				data: { "user_id": user_id,"folder_id": folder_id },
				success: function(cardlist){
					
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$('.basiccardslistHtml').html(cardlistArr.success);
					} else {
						msgerror = (cardlistArr.error)?cardlistArr.error:'';
						msgerror = '<span class="no-record-card">'+msgerror+'</span>';
						$('.basiccardslistHtml').html(msgerror);
					}
				},
				dataType: 'html'
			}); 
		} 
	}
	
	
	/*---------- Cards Search  ----------*/
	function cardSearch() {
		
		card_title = jQuery('#card_title').val();
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id){
			
			$.mobile.changePage("#basic-card-list",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-basic-card-list',
				beforeSend: function(){
					$('.loader_basiccardlist').show();
				},
				complete: function(){
					$('.loader_basiccardlist').hide();
				},
				data: { "user_id": user_id,"card_title": card_title },
				success: function(cardlist){
					
					var cardlistArr = jQuery.parseJSON(cardlist);
					if(!cardlistArr.error) {
						$('.basiccardslistHtml').html(cardlistArr.success);
					} else {
						msgerror = (cardlistArr.error)?cardlistArr.error:'';
						msgerror = '<span class="no-record-card">'+msgerror+'</span>';
						$('.basiccardslistHtml').html(msgerror);
					}
				},
				dataType: 'html'
			}); 
		} 
	}
	
	
	
	/*------------- Forgot Password ---------------*/	
	function forgotPassword() {
		
		$('#forgotpassword_form').validate({
			rules: {
				forgot_email: {
					required: true
				},
			},
			messages: {
				forgot_email: {
					required: "Email address is required."
				} 
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {	
			
				$.ajax({
					type: 'POST',
					url: webservice_url+'web-forget-password',
					beforeSend: function(){
						$('.loader_forgotpass').show();
					},
					complete: function(){
						$('.loader_forgotpass').hide();
					},
					data: { email: $("#forgot_email").val() },
					success: function(forgotData){ 
					
						var dataMsg = jQuery.parseJSON(forgotData);
						if(dataMsg.error){
							showAlert(dataMsg.error);
						}
						if(dataMsg.success){
							showAlert(dataMsg.success);
							$("#forgot-email").val('');
							$.mobile.changePage("#login",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
 						}
					},
					dataType: 'html'
				});
			}
		});
	}
	
 
	/*--------- Paper Card List-----------*/
	
	function paperCards() {
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id) {
			$.mobile.changePage("#paper-card-list",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-paper-card-list',
				beforeSend: function(){
					$('.loader_papercard').show();
				},
				complete: function(){
					$('.loader_papercard').hide();
				},
				data: { "user_id": user_id },
				success: function(papercardlist){
					
					var papercardlistArr = jQuery.parseJSON(papercardlist);
					if(!papercardlistArr.error) {
						$('.papercardHtml').html(papercardlistArr.success);
					} else {
						$(".errorMsgShow").show();
						$(".errorMsgShow").removeClass("success");
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(papercardlistArr.error);
						setTimeout(function() {
							$('.errorMsgShow').hide();
						}, 4000);
					}
				},
				dataType: 'html'
			});
		}
	} 


 	/*--------- Paper Card Details -----------*/
	
	function PapercardDetail(paper_card_id) {
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id) {
			$.mobile.changePage("#paper-card-details",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-paper-card-detail',
				beforeSend: function(){
					$('.loader_papercarddetail').show();
				},
				complete: function(){
					$('.loader_papercarddetail').hide();
				},
				data: { "user_id": user_id, "paper_card_id": paper_card_id },
				success: function(papercarddetail){
					
					var papercarddetailArr = jQuery.parseJSON(papercarddetail);
					if(!papercarddetailArr.error) {
						$('.papercarddetailHtml').html(papercarddetailArr.success);
					} else {
						$(".errorMsgShow").show();
						$(".errorMsgShow").removeClass("success");
						$(".errorMsgShow").addClass("error");
						$(".errorMsgShow").text(papercarddetailArr.error);
						setTimeout(function() {
							$('.errorMsgShow').hide();
						}, 4000);
					}
				},
				dataType: 'html'
			});
		}
	}  

	
	/*---------- Delete Paper Card ---------*/
	function deletePapercard(paper_card_id) {
		
		confirmBox = confirm('Are you sure you want to delete this paper card?');
		if(confirmBox==true) {
			$(".paper_card_dev_"+paper_card_id).remove();
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-paper-card-remove',
				beforeSend: function(){
					$('.loader_papercard').show();
				},
				complete: function(){
					$('.loader_papercard').hide();
				},
				data: { "paper_card_id": paper_card_id },
				success: function(papercardlist){
					var papercardlistArr = jQuery.parseJSON(papercardlist);
					if(!papercardlistArr.error) {
						showAlert(papercardlistArr.success);
					} else {
						showAlert(papercardlistArr.error);
 					}
				},
				dataType: 'html'
			});
		}
	}
	
	
	/*-------------- Add, Upload Paper Card --------------*/
	
	var pictureSourceCard;   // picture source
	var destinationTypeCard; // sets the format of returned value

	document.addEventListener("deviceready", onDeviceReadyCard, false);

	function onDeviceReadyCard() {
	    pictureSourceCard   = navigator.camera.PictureSourceType;
	    destinationTypeCard = navigator.camera.DestinationType;
	}

	function clearCache() {
	    navigator.camera.cleanup();
	} 


	var sPicDataCard; //store image data for image upload functionality

	function cardcapturePhoto(){
	    navigator.camera.getPicture(picOnSuccessCard, picOnFailureCard, {
	                                quality: 20,
	                                destinationTypeCard: destinationTypeCard.FILE_URI,
	                                sourceType: pictureSourceCard.CAMERA,
	                                correctOrientation: true
	                                });
	}

	function cardgetPhoto(){
	    navigator.camera.getPicture(picOnSuccessCard, picOnFailureCard, {
	        quality: 20,
	        destinationTypeCard: destinationTypeCard.FILE_URI,
	        sourceType: pictureSourceCard.SAVEDPHOTOALBUM,
	        correctOrientation: true
	    });
	}

	function picOnSuccessCard(imageData){

	    var image = document.getElementById('cameraPicCard');
	    image.src = imageData;
	    sPicDataCard  = imageData; //store image data in a variable
		userId = $('#user_id').val();
		photoUploadCard(userId);
	}

	function picOnFailureCard(message){
	   showAlert('Image not uploaded because: ' + message);
	}

	// ----- upload image ------------
	function photoUploadCard(userId) {
	    var options = new FileUploadOptions();
	    options.fileKey = "file";
	    options.fileName = sPicDataCard.substr(sPicDataCard.lastIndexOf('/') + 1);
	    options.mimeType = "image/jpeg";
	    options.chunkedMode = false;

	    var params = new Object();
	    params.fileKey = "file";
	    options.params = {}; // eig = params, if we need to send parameters to the server request
	    ft = new FileTransfer();
	    ft.upload(sPicDataCard, webservice_url+"add-paper-card/"+userId, wincard, failcard, options);
	}
	

	function wincard(r){
		/*------------ Images upload -----------*/
		message = (r.response)?r.response:'';
		showAlert(message);
		paperCards();
	}

	function failcard(error){
		message =  "An error has occurred: Code = " +error.code
		showAlert(message);
	} 
	
	
	/*--------- Register -----------*/  
	function register() {
	
		$('#register_form').validate({
			rules: {
				email: {
					required: true,
					email: true
				},
				c_email: {
					required: true,
					equalTo: "#email"
				},
				first_name: {
					required: true
				},
				last_name: {
					required: true
				},
				phone: {
					required: true,
					number: true , minlength: 10 , maxlength: 10
				},
				password: {
					required: true, minlength: 6
				},
				terms_conditions: {
					required: true
				},
			},
			messages: {
 				email: {
					required: "Please enter your email."
				},
				c_email: {
					required: "Please enter your confirm email.",
					equalTo: "Email address are not matching."
				},
 				first_name: {
					required: "Please enter your first name."
				},
 				last_name: {
					required: "Please enter your last name."
				},
				phone: {
					required: "Please enter your phone.",
					number: "Please enter your valid phone."
				},
				password: {
					required: "Please enter your password."
				},
				terms_conditions: {
					required: "Please agree terms & conditions."
				}
			},
			errorPlacement: function (error, element) {
				error.appendTo(element.parent().add());
			},
			submitHandler:function (form) {	

				$.ajax({
					type: 'POST',
					url: webservice_url+'web-register',
					beforeSend: function(){
						$('.loader_registeradd').show();
					},
					complete: function(){
						$('.loader_registeradd').hide();
					},
					data : $('#register_form').serialize(),
					success: function(registerData){ 
					
						var dataMsg = jQuery.parseJSON(registerData);	
						if(dataMsg.error){
							showAlert(dataMsg.error);	
						}
						if(dataMsg.success){
							showAlert(dataMsg.success)
							$("#register_form").trigger('reset');
							$.mobile.changePage("#login",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
						}
					},
					dataType: 'html'
				});
			}
		});	
	} 
	
	
	
	/*--------- Move Folder Lists -----------*/
	function moveTocard(card_id){
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id){
			$('#movetofolder').popup('open');
			$.ajax({
				type: 'POST',
				url: webservice_url+'web-folder-list',
				beforeSend: function(){
					$('.loader_movefolderlist').show();
				},
				complete: function(){
					$('.loader_movefolderlist').hide();
				},
				data: { "user_id": user_id, "card_id": card_id },
				success: function(folderlist){ 
					var folderArr = jQuery.parseJSON(folderlist);
					if(!folderArr.error) {
						$('.movetoHtml').html(folderArr.success);
					} else {
						msgerror = (folderArr.error)?folderArr.error:'';
						msgerror = '<span class="no-record-card-list">'+msgerror+'</span>';
						$('.movetoHtml').html(msgerror);
					}
				},
				dataType: 'html'
			});
		}  
	}
	
	/*--------- Move Folder Update -----------*/
	function moveTofoldersave(){
			
		$.ajax({
			type: 'POST',
			url: webservice_url+'web-folder-moveto',
			beforeSend: function(){
				$('.loader_movefolderlist').show();
			},
			complete: function(){
				$('.loader_movefolderlist').hide();
			},
			data : $('#move_folder').serialize(),
			success: function(movefolderData){ 
			
				var dataMsg = jQuery.parseJSON(movefolderData);	
				if(dataMsg.error){
					showAlert(dataMsg.error);
				}
				if(dataMsg.success){
					showAlert(dataMsg.success);
					myfolderList();
				}
			},
			dataType: 'html'
		});
	}  
	
	function pushConfirm() {
		var x;
		if (confirm("Do you want to send push notifications for this update?") == true) {
			x = "1";
			return x;
		} else {
			x = "2";
			return x;
		}
	}
	
	
	
	
    // alert dialog dismissed
    function alertDismissed() {
        // do something
    }

    // Show a custom alert
    //
    function showAlert(message) {
        navigator.notification.alert(
            message,  // message
            alertDismissed,         // callback
            'Smartcard Global',     // title
            'Ok'                  // buttonName
        );
    }
	
	
	$(document).on("pagechange", function (e, data) {
		var page = data.toPage[0].id;
		$(".card-list-page").removeClass("active-menu");
		$(".my-folderlist-page").removeClass("active-menu");
		$(".view-profile-page").removeClass("active-menu");
		$("."+page+'-page').addClass("active-menu");
	});


	/*----------- Logout -----------*/
	function logout(){ 
		window.localStorage.clear();
		$.mobile.changePage("#login"),{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"};
	} 
	
	
	$(document).on('vclick', '#edit_button_card', function(e){
		var pickid = $(this).attr("class");
		pickid = pickid.replace ( /[^\d.]/g, '' );
		pickid = parseInt(pickid);
		card_id = $('#card_id_get'+pickid).val();
		editCard(card_id);
	});
	
	$(document).on('vclick', '#share_button_card', function(e){
		var pickid = $(this).attr("class");
		pickid = pickid.replace ( /[^\d.]/g, '' );
		pickid = parseInt(pickid);
		share_fullname = $('#share_fullname'+pickid).val();
		share_user_photo = $('#share_user_photo'+pickid).val();
		share_shareUrl = $('#share_shareUrl'+pickid).val();
		window.plugins.socialsharing.share(share_fullname, null,share_user_photo, share_shareUrl);
	});
	
	$(document).on('vclick', '#detail_button_card', function(e){
		var pickid = $(this).attr("class");
		pickid = pickid.replace ( /[^\d.]/g, '' );
		pickid = parseInt(pickid);
		card_id = $('#card_id_get'+pickid).val();
		cartDetails(card_id);
	});
	
	
	
	function contactAdd(first_name,last_name,email,mobile,profilephoto) {
		//var profilephoto = profilephoto.replace("large", "thumb");
		
		var options = new ContactFindOptions();
		var full_name ='';
		if(first_name && last_name){
			full_name = first_name+' '+last_name;
		} else if(first_name!='' && last_name==''){
			full_name = first_name;
		} else if(first_name=='' && last_name!=''){
			full_name = last_name;
		}
		
		options.filter   = full_name;
		options.multiple = true; 
		var fields = ["displayName", "name"];
		navigator.contacts.find(fields, onSuccess, onErrorchek, options);
	
		function onSuccess(contacts) {
				
			   if(contacts.length>0){
					// already exists cheak
				  
				  
				  var to_add = contactConfirm();
				  if (to_add == 1){
					  var myContact = navigator.contacts.create(
						 {
						 "displayName":first_name,
						 "name":{
						 "givenName":first_name,
						 "formatted":full_name,
						 "familyName":last_name
						 },
						 "phoneNumbers":[
						 {"type":"mobile","value": mobile,"id":0,"pref":false}
						 ],
						 "emails":[
						 {"type":"home","value":email,"id":0,"pref":false}
						 ]
						 }
						 );
						 var photo=[];
						photo[0] = new ContactField('photo', profilephoto, false)
						myContact.photos = photo;
						myContact.save(onSuccesscon(myContact.name.givenName),onErrorcom);
				  }
				  
									// callback to invoke with index of button pressed
								// buttonLabels
					
					//confirmcheak = confirm('Contact already added. Wish to add again!','ND2NO');
				}
				
				if(contacts.length==0){
					// create a new contact object
					var myContact = navigator.contacts.create(
						 {
						 "displayName":first_name,
						 "name":{
						 "givenName":first_name,
						 "formatted":full_name,
						 "familyName":last_name
						 },
						 "phoneNumbers":[
						 {"type":"mobile","value": mobile,"id":0,"pref":false}
						 ],
						 "emails":[
						 {"type":"home","value":email,"id":0,"pref":false}
						 ]
						 }
						 );
						 var photo=[];
						photo[0] = new ContactField('photo', profilephoto, false)
						myContact.photos = photo;
						myContact.save(onSuccesscon(myContact.name.givenName),onErrorcom);
						
				}  	
		}
		
		function onErrorchek(contactError) {
			showAlert("Oops Something went wrong! Please try again later.");
		}
	}
	function onSuccesscon(full_name) {
		full_name = (full_name)?full_name:'Card'; 
		showAlert(full_name+" has been added to your contacts!")
	}

	function onErrorcom() {
		showAlert("Oops Something went wrong! Please try again later.");
	} 
	
	function contactConfirm() {
		var y;
		if (confirm("Contact details already exists, do you want to add again?") == true) {
			y = "1";
			return y;
		} else {
			y = "2";
			return y;
		}
	} 
	
	
	/*--------- Update Card Image -----------*/
	
	function imageTemplate(card_id, type) {
		
		user_id = localStorage.getItem('userid-travel');
		if(user_id==null || user_id==''){
			user_id = localStorage.getItem('userid-travel-2');
		}
		if(user_id && card_id && type) {
			$.mobile.changePage("#card-image-update",{allowSamePageTransition:false,reloadPage:false,changeHash:true,transition:"slide"});
			
			html_cardimage = '<img style="display:none;" id="cameraPicCard1" alt="" src=""><input type="hidden" name="card_id_image" id="card_id_image" value="'+card_id+'"><input type="hidden" name="card_type_image" id="card_type_image" value="'+type+'"><div id="camera" style="height: 60px;"><button class="camera-control ui-btn ui-shadow ui-corner-all" type="button" onclick="cardimagesPhoto('+card_id+','+type+');" style="width: 50%; float: left;">Camera</button><button class="camera-control ui-btn ui-shadow ui-corner-all" type="button" onclick="cardimagesgetPhoto('+card_id+','+type+');" style="width: 50%; float: right;">Gallery</button></div>'
			$('.cardimagesHtml').html(html_cardimage);
		}
	} 
	
	
	
	/*--------------  Update Card Images --------------*/
	
	var pictureSourceCardTemplate;   // picture source
	var destinationTypeCardTemplate; // sets the format of returned value

	document.addEventListener("deviceready", onDeviceReadyCardTemplate, false);

	function onDeviceReadyCardTemplate() {
	    pictureSourceCardTemplate   = navigator.camera.PictureSourceType;
	    destinationTypeCardTemplate = navigator.camera.DestinationType;
	}

	function clearCache() {
	    navigator.camera.cleanup();
	} 

	var sPicDataCardTemplate; //store image data for image upload functionality

	function cardimagesPhoto(){
	    navigator.camera.getPicture(picOnSuccessCardTemplate, picOnFailureCardTemplate, {
	                                quality: 20,
	                                destinationTypeCardTemplate: destinationTypeCardTemplate.FILE_URI,
	                                sourceType: pictureSourceCardTemplate.CAMERA,
	                                correctOrientation: true
	                                });
	}

	function cardimagesgetPhoto(){
	    navigator.camera.getPicture(picOnSuccessCardTemplate, picOnFailureCardTemplate, {
	        quality: 20,
	        destinationTypeCardTemplate: destinationTypeCardTemplate.FILE_URI,
	        sourceType: pictureSourceCardTemplate.SAVEDPHOTOALBUM,
	        correctOrientation: true
	    });
	}

	function picOnSuccessCardTemplate(imageData){
	
	    var image = document.getElementById('cameraPicCard1');
		image.src = imageData;
	    sPicDataCardTemplate  = imageData; //store image data in a variable
		card_id_image = $('#card_id_image').val();
		card_type_image = $('#card_type_image').val();
		photoUploadCardTemplate(card_id_image,card_type_image);
	}

	function picOnFailureCardTemplate(message){
	   showAlert('Image not uploaded because: ' + message);
	}

	// ----- upload image ------------
	function photoUploadCardTemplate(card_id_image,card_type_image) {
	    var options = new FileUploadOptions();
	    options.fileKey = "file";
	    options.fileName = sPicDataCardTemplate.substr(sPicDataCardTemplate.lastIndexOf('/') + 1);
	    options.mimeType = "image/jpeg";
	    options.chunkedMode = false;

	    var params = new Object();
	    params.fileKey = "file";
	    options.params = {}; // eig = params, if we need to send parameters to the server request
	    ft = new FileTransfer();
	    ft.upload(sPicDataCardTemplate, webservice_url+"update-card-image/"+card_id_image+'/'+card_type_image, wincardtemplate, failcardtemplate, options);
	}
	

	function wincardtemplate(r){
		card_id_image = $('#card_id_image').val();
		/*------------ Images upload -----------*/
		message = (r.response)?r.response:'';
		showAlert(message);
		cartDetails(card_id_image);
	}

	function failcardtemplate(error){
		message =  "An error has occurred: Code = " +error.code
		showAlert(message);
	}
	
	$(document).on('pageshow', '[data-role="page"]', function() {
		loading('hide', 1000);
	});