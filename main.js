allergens = [];
allergens.push({ id: '1', name: 'Peanuts', color: '#6b4b32', image: '/media/allergens/peanuts.png' })
allergens.push({ id: '2', name: 'Nuts', color: '#f15a25', image: '/media/allergens/nuts.png' })
allergens.push({ id: '3', name: 'Sesame Seeds', color: '#544741', image: '/media/allergens/sesame-seeds.png' })
allergens.push({ id: '4', name: 'Fish', color: '#29aae3', image: '/media/allergens/fish.png' })
allergens.push({ id: '5', name: 'Vegan', color: '#009345', image: '/media/allergens/vegan.png' })
allergens.push({ id: '6', name: 'Crustaceans', color: '#bb2b2b', image: '/media/allergens/crustaceans.png' })
allergens.push({ id: '7', name: 'Molluscs', color: '#23b574', image: '/media/allergens/molluscs.png' })
allergens.push({ id: '8', name: 'Eggs', color: '#d8a45b', image: '/media/allergens/eggs.png' })
allergens.push({ id: '9', name: 'Milk', color: '#0071bd', image: '/media/allergens/milk.png' })
allergens.push({ id: '10', name: 'Vegetarian', color: '#6e9334', image: '/media/allergens/vegetarian.png' })
allergens.push({ id: '11', name: 'Lupin', color: '#664266', image: '/media/allergens/lupin.png' })
allergens.push({ id: '12', name: 'Soya', color: '#736356', image: '/media/allergens/soya.png' })
allergens.push({ id: '13', name: 'Celery', color: '#8cc63e', image: '/media/allergens/celery.png' })
allergens.push({ id: '14', name: 'Mustard', color: '#f8931f', image: '/media/allergens/mustard.png' })
allergens.push({ id: '15', name: 'Sulphur dioxide', color: '#666666', image: '/media/allergens/sulphur-dioxide.png' })
allergens.push({ id: '16', name: 'Tree Nuts', color: '#a67c52', image: '/media/allergens/tree-nuts.png' })
allergens.push({ id: '17', name: 'Wheat', color: '#91432C', image: '/media/allergens/wheat.png' })
allergens.push({ id: '19', name: 'Sulphate', color: '#0266fc', image: '/media/allergens/sulphate.png' })
allergens.push({ id: '20', name: 'Gluten', color: '#91432C', image: '/media/allergens/gluten.png' })
allergens.push({ id: '21', name: 'Garlic', color: '#beb198', image: '/media/allergens/garlic.png' })



var isonCheckout=false;

var splitTok = "THISTOKEN";
function getLoyCard() {
	document.querySelector('#globalLoader').show();
	$.ajax({
		method: "POST",
		dateType: "json",
		crossDomain: true,
		url: BASE_URL + "/getLoyCount",
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + {
		}
	})
		.done(function (msg) {
			localStorage.setItem("myTOK", msg.split('THISTOKEN')[1]);
			msg = msg.split('THISTOKEN')[0];
			document.querySelector('#globalLoader').hide();
			msg1 = JSON.parse(msg);
			if (msg1 == "FALSE") {
				one.notification.alert("No loyalty card available");
				return false;

			}
			msgLeft = 9 - msg1;
			if (msgLeft == 0)
				$('#youHave').text(`You can claim your free item`);
			else
				$('#youHave').text(`You have ${msgLeft} purchases before your free item`);
			$(".loyCard").each(function (index) {
				$(this).find('i').css("color", "");
			});

			$(".loyCard").each(function (index) {
				if (index < msg1) {
					$(this).find('i').css("color", "var(--main-1)");

				}
			});
			showLoginModal('loyaltyCard');




		})


}

function getReviewModal(temp_review) {

	$('#temp_review_modal').val(temp_review);
	showLoginModal('reviewModal');
}



function cameraTakePicture() {
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			if (result.text != "")
				repeatOrder(result.text);

		},
		function (error) {
			alert("Scanning failed: " + error);
		},
		{
			preferFrontCamera: true, // iOS and Android
			showFlipCameraButton: true, // iOS and Android
			showTorchButton: true, // iOS and Android
			torchOn: true, // Android, launch with the torch switched on (if available)
			saveHistory: true, // Android, save scan history (default false)
			prompt: "Place a barcode inside the scan area", // Android
			resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
			orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
			disableAnimations: true, // iOS
			disableSuccessBeep: false // iOS and Android
		}
	);
}

function logout() {

	$.ajax({
		method: "POST",
		crossDomain: true,
		url: BASE_URL + "/customerLogout",
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + {}
	}).done(function (msg) {
		localStorage.setItem("myTOK", msg.split('THISTOKEN')[1]);
		msg = msg.split('THISTOKEN')[0];
		ons.notification.toast('Logged out', { timeout: 1000, animation: 'fall' });
		localStorage.setItem("logged", false);
		localStorage.setItem("loggedName", "");
		localStorage.setItem("isLogged", false);

		mynav.resetToPage('start.html', { data: { title: "title" } });
		$('#menu').attr("mode", "collapse");
		$('#logoutList').hide();
		document.querySelector('#menu').close();


	});

}
function repeatOrder(ids) {
	var reo = '';
	$.ajax({
		url: BASE_URL + "/reorder",
		type: "POST",

		//data : 'my-tok=' +localStorage.getItem('myTOK') + '&' +'ids='+ids',
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'ids=' + ids,
		crossDomain: true,
		success: function (data) {
			localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
			data = data.split('THISTOKEN')[0]; data = JSON.parse(data);
			thisBranch = typeof data.branch_id == "undefined" ? 0 : data.branch_id;

			if (data == "FAILEDNO") {
				ons.notification.toast('<span style="color:black !important;">Repeat order failed</span>', { timeout: 1000, animation: 'ascend' });
			} else if (data == "FAILED") {

				ons.notification.toast('<span style="color:black !important;">Please select collection/delivery or order at table</span>', { timeout: 1000, animation: 'ascend' });
				localStorage.setItem("repeatOrder", ids);
				goToStart();

			} else if (thisBranch > 0) {
				ons.notification.toast('<span style="color:black !important;">Please select collection/delivery or order at table</span>', { timeout: 1000, animation: 'ascend' });
				localStorage.setItem("repeatOrder", ids);
				localStorage.setItem("getBranch", thisBranch);

				goToStart();


			} else {
				loadPage('cart.html');

			}



		}

	});
}

function goToStart() {

	mynav.resetToPage('start.html?id=5');
}

function resetPassword() {
	var email = $("#emailReset").val();

	$.ajax({
		url: BASE_URL + "/forgot_password",
		type: "POST",

		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'email=' + email,
		success: function (response) {
			localStorage.setItem("myTOK", response.split('THISTOKEN')[1]);
			response = response.split('THISTOKEN')[0]; response = JSON.parse(response);
			if (response == 'OK') {
				ons.notification.alert('Password reset link has been sent to your email address if it exists in our system');
				hideLoginModal('forgotPassword');
				return true;
			}
		}
	});


}

function updateDetails() {
	var fullname = $("#nameEdit").val();
	var pwd = $("#passEdit").val();
	var phone = $("#phoneEdit").val();
	var email = $("#emailEdit").val();
	$.ajax({
		url: BASE_URL + "/UpdateCustomer/true",
		type: "POST",

		async: false,
		crossDomain: true,
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'pwd=' + pwd + '&phone=' + phone + '&email=' + email + '&fullname=' + fullname,
		success: function (data) {
			localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
			data = data.split('THISTOKEN')[0]; data = JSON.parse(data);
			console.log(data);
			if (data == "OK") {
				ons.notification.alert('Your details have been updated!');
				hideLoginModal('editProfile');
				$("#passEdit").val("");
				localStorage.setItem("loggedName", fullname);
				document.getElementById("buttonHi").innerText = "Hi " + localStorage.getItem("loggedName");
				$('#cname').val(localStorage.getItem("loggedName"));



			} else {
				ons.notification.alert(data);
				$("#passEdit").val("");
			}
		}
	});


}

function getProfile() {

	$.ajax({
		url: BASE_URL + "/editProfiles",
		type: "POST",

		async: false,
		crossDomain: true,
		/*data : 'my-tok=' +localStorage.getItem('myTOK') + '&' +'pwd='+pwd+'&phone='+phone+'&email='+email+'&privacy='+checkedPrivacy+'&fullname2='+fullname2,*/
		success: function (data) {
			localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
			data = data.split('THISTOKEN')[0]; data = JSON.parse(data);
			if (data != 'FALSE') {
				var str = jQuery.parseJSON(data['CustomData']);
				$("#nameEdit").val(str['name']);
				$("#phoneEdit").val(str['phone']);
				$("#passEdit").val("");
				$("#emailEdit").val(str['email']);
				showLoginModal('editProfile');
				document.querySelector('#menu').close();

			} else {
				ons.notification.alert("ERROR");
				mynav.resetToPage("start.html");
				document.querySelector('#menu').close();

			}
		}
	});


}

function userRegister() {
	var fullname2 = $("#nameRegister").val();
	var pwd = $("#passRegister").val();
	var zipCode = $("#zipRegister1").val();

	var phone = $("#phoneRegister").val();
	var email = $("#userRegister").val();
	var dob = $("#dobRegister").val();
	var opt = $("#optBox").prop("checked");
	var checkedPrivacy = $("#vehicle1").prop("checked");

	if (email == '') {
		ons.notification.alert('Please enter email!');
		return false;
	}
	if (pwd == '') {
		ons.notification.alert('Please enter password');
		return false;
	}
	if (fullname2 == '') {
		ons.notification.alert('Please enter name!');
		return false;
	}
	if (phone == '') {
		ons.notification.alert('Please enter phone number');
		return false;
	}

	if (pwd.length <= 20 && pwd.length >= 8) {

	} else {
		ons.notification.alert("Make sure the password is between 8 and 20 characters long");
		return false;
	}

	$('#signUpModal').prop('disabled', true);

	$.ajax({
		url: BASE_URL + "/addCustomerRegister",
		type: "POST",

		async: false,
		crossDomain: true,
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'pwd=' + pwd + '&phone=' + phone + '&email=' + email + '&privacy=' + checkedPrivacy + '&fullname2=' + fullname2 + '&zipCode=' + zipCode + '&dob=' + dob + '&opt=' + opt,
		success: function (data) {
			localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
			data = data.split('THISTOKEN')[0]; data = JSON.parse(data);
			$('#signUpModal').prop('disabled', false);

			if (data == 'OK') {
				localStorage.setItem("loggedName", fullname2);
				$("#RetuserName").html(fullname2);
				ons.notification.alert('Successfully signed up');
				//loadPage('start.html');
				document.querySelector('#registerModal').hide();
				$('.loggedIn').show();
				$('.loggedOut').hide();
				$("#nameRegister").val('');
				$("#passRegister").val('');

				$("#phoneRegister").val('');
				$("#userRegister").val('');
				$("#dobRegister").val('');
				$("#optBox").val('');

				$("#vehicle1").prop("checked", false);

				whenLogin(true);

				// goToStart();
				if(isonCheckout){
					loadPage('cart.html');
				}else{
					goToStart();
				}
				isonCheckout=false;
				

			}
			else {
				whenLogin(false);

				ons.notification.alert(data);
				//grecaptcha.reset(html_element_1_id);
				$("#signupdiv").prop('disabled', false);
				return false;
			}
		}, error: function (xhr, textStatus, errorThrown) {
			$('#signUpModal').prop('disabled', false);


		}
	});
}
function changeMenu() {
	addBG = 0;
	$('.mainMenu').each(function () {
		if ($(this).is(":visible")) {
			if (addBG % 2 == 0) {
				$(this).addClass("menu1");
				$(this).removeClass("menu2");
			}
			else {
				$(this).addClass("menu2");
				$(this).removeClass("menu1");
			}

			//	$(this).addClass("altMenu");
			addBG++
		} else {
			//$(this).removeClass("altMenu");
		}

	})
}
function whenLogin(logState) {
	addBG = 0;
	$('.mainMenu').each(function () {
		if ($(this).is(":visible")) {
			if (addBG % 2 == 0) {
				$(this).css("color", "var(--main-2)");

				$(this).css("background-color", "var(--main-1)");
			}
			else {
				$(this).css("color", "var(--main-1)");

				$(this).css("background-color", "var(--main-2)");
			}

			//	$(this).addClass("altMenu");
			addBG++
		} else {
			//$(this).removeClass("altMenu");
		}

	})
	if (logState === true) {
		$('#buttonHi').show();
		document.getElementById("buttonHi").innerText = "Hi " + localStorage.getItem("loggedName");
		$('#cname').val(localStorage.getItem("loggedName"));

	} else {
		$('#buttonHi').hide();
		$('#cname').val("");

	}
	localStorage.setItem("isLogged", logState);
}
function userLogin() {
	document.querySelector('#menu').close();

	var custusernm = $("#username").val();

	var custpassword = $("#password").val();
	$.ajax({
		method: "POST",
		dateType: "json",
		crossDomain: true,
		url: BASE_URL + "/getCustomerRegister",
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'custusernm=' + custusernm + '&custpassword=' + custpassword,

	})
		.done(function (msg) {
			localStorage.setItem("myTOK", msg.split('THISTOKEN')[1]);
			msg = msg.split('THISTOKEN')[0];
			msg = JSON.parse(msg);
			console.log(msg[0].CustomData);
			//localStorage.setItem("myTOK",msg[0].myTOK);		

			if (msg != "FALSE") {
				$("#username").val('');
				ons.notification.toast('<span style="color:black !important;">Logged in!</span>', { timeout: 1000, animation: 'ascend' });

				$("#password").val('');
				localStorage.setItem("loggedName", JSON.parse(msg[0].CustomData).name);
				$("#usrName").html("Hey there, " + JSON.parse(msg[0].CustomData).name);
				$("#RetuserName").html(JSON.parse(msg[0].CustomData).name);

				$('.loggedIn').show();
				$('.loggedOut').hide();

				//loadPage('category.html');
				document.querySelector('#loginModal').hide();
				whenLogin(true);

				if(isonCheckout){
					loadPage('cart.html');
				}else{
					goToStart();
				}
				isonCheckout=false;

			}

			else {

				ons.notification.alert('Incorrect username or password');
				whenLogin(false);

				return false;

			}


		});


}
function customerReview() {


	var rate = $("input[name='rating']:checked").val();
	var cname = $("#cname").val();
	var temp_review_modal = $("#temp_review_modal").val();

	var cdesc = $("#cdesc").val();


	if (cname == '') {
		ons.notification.alert('Please enter name');
		return false;
	}
	if (cdesc == '') {
		ons.notification.alert('Please type comments');
		return false;
	}
	$.ajax({
		url: BASE_URL + "/customerReview/" + temp_review_modal,
		type: "POST",

		crossDomain: true,
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + '&cname=' + cname + '&cdesc=' + cdesc + '&rate=' + rate,
		success: function (data) {
			localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
			data = data.split('THISTOKEN')[0]; data = JSON.parse(data);
			if (data == 'OK') {

				ons.notification.alert('Thanks for your review');

				$("#cname").val("");
				$("#cdesc").val("");
				hideLoginModal('reviewModal');

			}
			else if (data == "exists") {
				$("#cname").val("");
				$("#cdesc").val("");

				hideLoginModal('reviewModal');

				ons.notification.alert('Error');
			} else {
				ons.notification.alert('Error');
			}

		}
	});
}


var load = 0;
document.addEventListener('destroy', function (event) {
	console.log(event);
	// Set up content...

}, false);
const mynav = document.querySelector('#navigator');

const openMenu = () => {
	changeMenu();
	document.querySelector('#menu').open();
};
//cordova code


function showLoginModal(toShow) {
	if (toShow == "qrModal") {
		$.ajax({
			url: BASE_URL + "/custDetails",
			type: "POST",

			crossDomain: true,

			success: function (response) {
				localStorage.setItem("myTOK", response.split('THISTOKEN')[1]);
				response = response.split('THISTOKEN')[0]; response = JSON.parse(response);
				response1 = JSON.parse(response.cust[0].CustomData);
				response2 = response1.loyalty;
				document.getElementById("qrLoyalty").innerHTML = "";
				new QRCode(document.getElementById("qrLoyalty"), response2);
				$("#qrLoyalty > img").css({ "margin": "auto" });

				$('#loyBal').html("Your loyalty balance is " + response.LoyaltyAmount);
				var modal = document.querySelector('#' + toShow);
				modal.show();
				return false;
			}
		});







	}
	if (toShow != "qrModal") {

		var modal = document.querySelector('#' + toShow);
		modal.show();
	}

}

function hideLoginModal(toShow) {
	var modal = document.querySelector('#' + toShow);
	modal.hide();
	document.querySelector('#menu').close();


}

function showPopup(id, portid, ro, defaultMods) {
	ro = typeof ro == "undefined" ? "-1" : ro;
	defaultMods = typeof defaultMods == "undefined" ? "0" : defaultMods;

	localStorage.setItem("ro", ro);
	mynav.bringPageTop('orderTags.html', {
		data: {
			id: id,
			portid: portid,
			defaultMods: defaultMods,

		}
	});

}






//cordova code

logged = false;

const loadPage = (page) => {
	document.querySelector('#menu').close();
	mynav.bringPageTop(page, { animation: 'fade' });
};


const startBranch = (branch_id, table, location, lat, lon) => {
	branch_id = (typeof branch_id === 'undefined') ? 0 : branch_id;
	table = (typeof table === 'undefined') ? 0 : table;
	location = (typeof location === 'undefined') ? 0 : location;

	if (branch_id == 0)
		branchURL = BASE_URL + "/check_postcode_by_branch/";
	else
		branchURL = BASE_URL + "/check_postcode_by_branch_collection/" + branch_id;

	if (table == 0) {
		$('#tableList1').hide();
		$('#onlineList').show();

		$("#btnColl").addClass("activebtnOrd").removeClass("inactivebtnOrd");
		$("#tableOrder" + branch_id).addClass("inactivebtnOrd").removeClass("activebtnOrd");

	} else {
		$('#tableList1').show();
		$('#onlineList').hide();

		$("#tableOrder" + branch_id).addClass("activebtnOrd").removeClass("inactivebtnOrd");
		$("#btnColl").addClass("inactivebtnOrd").removeClass("activebtnOrd");

		toSelect = "";
		allTables = JSON.parse(localStorage.getItem("setCats"));
		toSelect = `<ons-row style="display:inline"><span style="font-size: 18px; color:#fff;font-weight: 500;">Select Table?</span><br><ons-select  style="color:white;width:50%" id="choose-table" class="getTable" >`;
		toSelect += `<option value="noneSelected">Where are you seated?<\/option>`;
		listBranch2 = document.querySelector('#tableList');
		listBranch2.innerHTML = "";
		allTables.forEach(cats => {
			if (typeof cats.branch_id == "undefined")
				toSelect += `<option style="background-color:#222021;color:white" value="${cats.Id}">Table  ${cats.Name}<\/option>`;
			else if (cats.branch_id == 0 || cats.branch_id == branch_id)
				toSelect += `<option style="background-color:#222021;color:white" value="${cats.Id}">Table  ${cats.Name}<\/option>`;
		})
		toSelect += '</ons-select></ons-row>';
		listBranch2.appendChild(ons.createElement(toSelect));



	}
	startBranchPost = $('#startBranch').val();
	localStorage.setItem("userPostcode", startBranchPost);
	$.ajax({
		method: "POST",
		dateType: "json",
		crossDomain: true,
		url: branchURL,
		data: {
			'my-tok': localStorage.getItem('myTOK'),
			'zip_code': startBranchPost,
			'table': table,
			'lat': lat,
			'lon': lon,
			'location': location
		},


	})
		.done(function (msg1) {
			localStorage.setItem("myTOK", msg1.split('THISTOKEN')[1]);
			msg1 = msg1.split('THISTOKEN')[0];
			msg = JSON.parse(msg1);
			if (msg == "FAILEDT") {
				ons.notification.alert("Sorry we're closed!");
				return;


			}
			if (msg == "login") {
				ons.notification.alert("Please login/register first");
				return;


			}
			localStorage.setItem("currentBranch", msg['branch_id']);
			if (msg['allow_by_distance'] == "c") {
				if (branch_id == 0)
					ons.notification.alert("We do not deliver to your postcode but you can still collect!");
				$('#showGoBack').show();
				$('#hideDelivery').hide();
				$('#hideCollection').show();
				$('#collection').prop("checked", "checked");
				fillDays(localStorage.getItem("collectDays"));
				checkSlots(0)

			} else if (msg['allow_by_distance'] == "d") {
				$('#showGoBack').show();
				$('#hideDelivery').show();
				$('#hideCollection').hide();
				$('#delivery').prop("checked", "checked");
				fillDays(localStorage.getItem("deliveryDays"));

				checkSlots(0)

			} else if (msg != "FAILED") {
				$('#showGoBack').show();
				$('#hideDelivery').show();
				if (localStorage.getItem("hide_col") != 1)
					$('#hideCollection').show();
				else
					$('#hideCollection').hide();

				$('#delivery').prop("checked", "checked");
				fillDays(localStorage.getItem("deliveryDays"));

				checkSlots(1)
			} else {
				if (branch_id != 0)
					ons.notification.alert("Try Again");
				else
					ons.notification.alert("Please enter a valid postcode");
				return;
			}
			$('#firstBranchForm').hide();

			$('#secondBranchForm').show();
			$('#currBranch').html(msg.branch_name);




		});



}
function goBack() {
	$('#firstBranchForm').show();
	$('#showGoBack').hide();

	$('#secondBranchForm').hide();

}

const checkSlots = (type, selectChange) => {
	showModal1();
	if (typeof type == "undefined") {
		if ($("#collection").prop("checked"))
			type = 0;
		else
			type = 1;
	}
	selectChange = typeof selectChange == "undefined" ? 0 : 1;
	if (selectChange == 1) {
		if (type == 0) {
			fillDays(localStorage.getItem("collectDays"));
		} else {
			fillDays(localStorage.getItem("deliveryDays"));
		}
	}
	dateSelect = $('#dateSelect').children("option:selected").val();
	$.ajax({
		url: BASE_URL + '/checkSlot',
		crossDomain: true,
		type: "POST",


		data: { 'my-tok': localStorage.getItem('myTOK'), 'order_date': dateSelect, 'orderType': type },
		success: function (data) {
			localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
			data = data.split('THISTOKEN')[0]; data = JSON.parse(data);
			allSlots = data['start'];
			allSlots2 = data['end'];
			//	$("#timepicker1").select2({ data : 'my-tok=' +localStorage.getItem('myTOK') + '&' +allSlots,    minimumResultsForSearch: Infinity});

			htmlButton = "";
			for (k in allSlots) {
				if (allSlots[k] == "No times available")
					htmlButton += '<a onclick="checkTiming(\'' + allSlots[k] + '\')" class="tlacidlo">' + allSlots[k] + '</a>';
				else {
					if (allSlots[k] == allSlots2[k])
						htmlButton += '<a onclick="checkTiming(\'' + allSlots[k] + '\')" class="tlacidlo">' + allSlots[k] + '</a>';
					else
						htmlButton += '<a onclick="checkTiming(\'' + allSlots[k] + '\')" class="tlacidlo">' + allSlots[k] + ' - ' + allSlots2[k] + '</a>';
				}
			}
			$("#timeBox").html(htmlButton);

		}

	});



}

const donePokemon = (tick, button) => {
	button.innerHTML = "Added";
	button.setAttribute("onclick", "trynew()");
	getArr = JSON.parse(localStorage.getItem("currTicks"));
	if (!getArr) {
		getArr = [];
	}
	getArr.push(tick);
	localStorage.setItem("currTicks", JSON.stringify(getArr));
}
function trynew() {

	alert("true");
}
function hideFrame() {

	//

}
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
	if (event.origin !== "http://example.org:8080")
		$('#frame1').hide();

}


function find() {
	document.querySelector('#navigator').pushPage('about.html', {
		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + {
			title: 'Page 2'
		}
	});

}




function getCategory() {
	$.ajax({
		type: "POST",
		url: BASE_URL + '/getMapingCategoryByDept',

		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + '',
		success: function (response) {

			localStorage.setItem("myTOK", response.split('THISTOKEN')[1]);
			response = response.split('THISTOKEN')[0]; response = JSON.parse(response);

			console.log(response);
			// var catList = document.querySelector('#categoryList');

			// catList.innerHTML = "";
			//msg = JSON.parse(msg);
			//currTicks =[];
			i = 0;
			$("#MenuDrinkList").html("");
			$("#MenuFoodList").html("");
			response.forEach(name1 => {



				i++;
				// if (i == response.length)
				// 	exp = "expanded";
				// else
				// 	exp = "";
				// if (i % 2 == 0) {
				// 	buttonStyle = "background-color:var(--main-5); !important;";
				// 	colorStyle = "color:var(--main-2); !important;";


				// } else {
				// 	buttonStyle = "background-color:var(--main-2); !important;";
				// 	colorStyle = "color:var(--main-5); !important;";
				// }
				// catList.appendChild(ons.createElement('<ons-list-item data-cat="' + name1.GroupCode + '" expandable style="' + buttonStyle + colorStyle + '" class="aCategoryItem catExpanded ' + exp + '"> <div style="width:100%"  onclick="getProducts(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.description + '\',1)"  class="left">' + name1.name + '</div><div  id="cat' + name1.GroupCode + '" class="expandable-content"></div></ons-list-item>'));


				if (name1.app_type_flag == 0) {

					$("#MenuFoodList").append(

						'<div class="container">' +
						'<div class="row justify-content-between px-3 py-3">' +
						'<span style="font-size: 18px;color: black;font-weight:600;">' + name1.name + '</span>' +
						'<span style="font-size: 14px;color: gray;text-transform: uppercase;" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.name + '\',0)">See All</span>' +
						'</div>' +
						'<div class="MenuList" style="width:100%; display: inline-flex; overflow: auto;padding: 0px 0px 10px 0px;margin-top: -10px;" id="row' + name1.GroupCode + '">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.description + '\',0)">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.description + '\',0)">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.description + '\',0)">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.description + '\',0)">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.description + '\',0)">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.description + '\',0)">' +
						'</div>' +
						'</div>'

					);


					$("#allCatPro").append(
						'<ul class="list-group py-2" id="allPro' + name1.GroupCode + '">' +
						'<li class="list-group-item " style="font-weight: 600;border: 1px solid grey !important;border-width: 0px 0px 1px 0px !important;">' + name1.name + '</li><ul>'
					);





					//get product
					// $.ajax({
					// 	url: BASE_URL + "/getProducts2",
					// 	type: "POST",

					// 	data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'category_id=' + name1.GroupCode,
					// 	crossDomain: true,
					// 	success: function (data) {

					// 		localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
					// 		data = data.split('THISTOKEN')[0]; data = JSON.parse(data);


					// 		i = 0;
					// 		if (Array.isArray(data)) {

					// 			$("#row" + name1.GroupCode).html("");

					// 			data.forEach(name2 => {
					// 				//buttonStyle=
					// 				if (name2.cat_deals != "0") {
					// 					//console.log("hear");

					// 					clickFunction = "startDeal(" + name2.PortionIDcart + ")";

					// 				} else {

					// 					clickFunction = "addToCart(" + name2.Id + ',' + name2.PortionIDcart + ")";
					// 				}

					// 				if (name2.restrict_product != "0") {
					// 					if (name2.cat_deals != "0")
					// 						clickFunction = "confirmAge(" + name2.Id + ',' + name2.PortionIDcart + ",1)";
					// 					else
					// 						clickFunction = "confirmAge(" + name2.Id + ',' + name2.PortionIDcart + ",0)";

					// 				}

					// 				if ((name2.in_stock > 0) || name2.in_stock == 'IN STOCK') {
					// 					displayIcon = '<ons-icon  onclick="' + clickFunction + '" style="color:var(--main-2);font-size: 36px; padding:0px 10px;" icon="fa-plus-circle"></ons-icon>';


					// 				} else {
					// 					clickFunction = 'ons.notification.alert(\'Out of stock\');';
					// 					displayIcon = '<ons-icon  onclick="' + clickFunction + '" style="color:red;font-size: 36px; padding:0px 10px;" icon="fa-times"></ons-icon>';
					// 				}

					// 				// if (name2.old_price != 0)
					// 				// 	priceDisplay = '<span style="text-decoration: line-through;">' + '£' + parseFloat(name2.old_price).toFixed(2) + '</span>' + '£' + parseFloat(name1.price).toFixed(2) + displayIcon;
					// 				// else
					// 				// 	priceDisplay = '£' + parseFloat(name2.price).toFixed(2) + displayIcon;

					// 				//console.log(clickFunction);
					// 				if (name2.image != "")
					// 					imgurl = 'https://live.bb01.net/back/uploads/' + name2.image;
					// 				else
					// 					imgurl = localStorage.getItem("logo_url");
					// 				//			allProducts += ' <ons-col style="text-align:center" width="50%"><img style="width:125px;height:125px;border: 2px #dbdbdb solid;padding: 5px;" src="'+imgurl+'"><p style="margin-top:-133px;margin-left:76px;color:black"><ons-button class="productButton" style="'+buttonStyle+'"  onclick="'+clickFunction+'">'+name1.Name+' '+name1.portionname+'</ons-button></p><p style="margin-top:56px"><ons-button class="productButton" style=";max-width:50%;'+buttonStyle+'"  onclick="'+clickFunction+'"> + £'+parseFloat(name1.price).toFixed(2) + '</ons-button></p><p><ons-icon  onclick="'+clickFunction+'" style="color:#BABFD1;font-size: 36px;" icon="fa-plus-circle"></ons-icon></p>					</ons-col>';

					// 				i++;

					// 				$("#row" + name1.GroupCode).append(
					// 					// '<img src="' + imgurl + '" alt="" srcset="" class="img-thumbnail m-2" onclick="' + clickFunction + '">'
					// 					'<figure class="figure" onclick="' + clickFunction + '">' +
					// 					'<img src="' + imgurl + '" class="figure-img img-fluid rounded img-thumbnail" alt="...">' +
					// 					'<figcaption class="figure-caption text-center">' + name2.Name + '</figcaption>' +
					// 					'</figure>'
					// 				);

					// 				$("#allPro" + name1.GroupCode).append(
					// 					'<li class="list-group-item" onclick="' + clickFunction + '">' + name2.Name + '</li>'
					// 				);


					// 			});
					// 		}
					// 	}
					// });

				} else if (name1.app_type_flag == 1) {

					$("#MenuDrinkList").append(

						'<div class="container">' +
						'<div class="row justify-content-between px-3 py-3">' +
						'<span style="font-size: 18px;color: black;font-weight:600;">' + name1.name + '</span>' +
						'<span style="font-size: 14px;color: gray;" onclick="gotoProductList(\'' + name1.GroupCode + '\', this,\'active\',\'' + name1.name + '\',0)">View All</span>' +
						'</div>' +
						'<div class="MenuList" style="width:100%; display: inline-flex; overflow: auto;padding: 0px 0px 10px 0px;margin-top: -10px;" id="row' + name1.GroupCode + '">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2">' +
						// '<img src="asset/img/home-bg.png" alt="" srcset="" class="img-thumbnail m-2">' +
						'</div>' +
						'</div>'
					);

					$("#allCatPro").append(
						'<ul class="list-group py-2" id="allPro' + name1.GroupCode + '">' +
						'<li class="list-group-item " style="font-weight: 600;border: 1px solid grey !important;border-width: 0px 0px 1px 0px !important;">' + name1.name + '</li><ul>'
					);

					//get product
					// $.ajax({
					// 	url: BASE_URL + "/getProducts2",
					// 	type: "POST",

					// 	data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'category_id=' + name1.GroupCode,
					// 	crossDomain: true,
					// 	success: function (data) {

					// 		localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
					// 		data = data.split('THISTOKEN')[0]; data = JSON.parse(data);


					// 		i = 0;
					// 		if (Array.isArray(data)) {

					// 			$("#row" + name1.GroupCode).html("");

					// 			data.forEach(name2 => {
					// 				//buttonStyle=
					// 				if (name2.cat_deals != "0") {
					// 					//console.log("hear");

					// 					clickFunction = "startDeal(" + name2.PortionIDcart + ")";

					// 				} else {

					// 					clickFunction = "addToCart(" + name2.Id + ',' + name2.PortionIDcart + ")";
					// 				}

					// 				if (name2.restrict_product != "0") {
					// 					if (name2.cat_deals != "0")
					// 						clickFunction = "confirmAge(" + name2.Id + ',' + name2.PortionIDcart + ",1)";
					// 					else
					// 						clickFunction = "confirmAge(" + name2.Id + ',' + name2.PortionIDcart + ",0)";

					// 				}

					// 				if ((name2.in_stock > 0) || name2.in_stock == 'IN STOCK') {
					// 					displayIcon = '<ons-icon  onclick="' + clickFunction + '" style="color:var(--main-2);font-size: 36px; padding:0px 10px;" icon="fa-plus-circle"></ons-icon>';


					// 				} else {
					// 					clickFunction = 'ons.notification.alert(\'Out of stock\');';
					// 					displayIcon = '<ons-icon  onclick="' + clickFunction + '" style="color:red;font-size: 36px; padding:0px 10px;" icon="fa-times"></ons-icon>';
					// 				}

					// 				// if (name2.old_price != 0)
					// 				// 	priceDisplay = '<span style="text-decoration: line-through;">' + '£' + parseFloat(name2.old_price).toFixed(2) + '</span>' + '£' + parseFloat(name1.price).toFixed(2) + displayIcon;
					// 				// else
					// 				// 	priceDisplay = '£' + parseFloat(name2.price).toFixed(2) + displayIcon;

					// 				//console.log(clickFunction);
					// 				if (name2.image != "")
					// 					imgurl = 'https://live.bb01.net/back/uploads/' + name2.image;
					// 				else
					// 					imgurl = localStorage.getItem("logo_url");
					// 				//			allProducts += ' <ons-col style="text-align:center" width="50%"><img style="width:125px;height:125px;border: 2px #dbdbdb solid;padding: 5px;" src="'+imgurl+'"><p style="margin-top:-133px;margin-left:76px;color:black"><ons-button class="productButton" style="'+buttonStyle+'"  onclick="'+clickFunction+'">'+name1.Name+' '+name1.portionname+'</ons-button></p><p style="margin-top:56px"><ons-button class="productButton" style=";max-width:50%;'+buttonStyle+'"  onclick="'+clickFunction+'"> + £'+parseFloat(name1.price).toFixed(2) + '</ons-button></p><p><ons-icon  onclick="'+clickFunction+'" style="color:#BABFD1;font-size: 36px;" icon="fa-plus-circle"></ons-icon></p>					</ons-col>';

					// 				i++;

					// 				$("#row" + name1.GroupCode).append(
					// 					// '<img src="' + imgurl + '" alt="" srcset="" class="img-thumbnail m-2" onclick="' + clickFunction + '">'
					// 					'<figure class="figure" onclick="' + clickFunction + '">' +
					// 					'<img src="' + imgurl + '" class="figure-img img-fluid rounded img-thumbnail" alt="...">' +
					// 					'<figcaption class="figure-caption text-center">' + name2.Name + '</figcaption>' +
					// 					'</figure>'
					// 				);

					// 				$("#allPro" + name1.GroupCode).append(
					// 					'<li class="list-group-item" onclick="' + clickFunction + '">' + name2.Name + '</li>'
					// 				);


					// 			});
					// 		}
					// 	}
					// });

				}



			})
			// getProducts(response[response.length - 1].GroupCode, '', '', response[response.length - 1].description, 1);
			getAllProduct();
		}
	});


}


function getAllProduct(){

	$.ajax({
		url: BASE_URL + "/getProducts2",
		type: "POST",

		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'category_id=All',
		crossDomain: true,
		success: function (data) {			

			localStorage.setItem("myTOK", data.split('THISTOKEN')[1]);
			data = data.split('THISTOKEN')[0]; data = JSON.parse(data);
			i = 0;
			if (Array.isArray(data)) {
				// console.log(data);			

				data.forEach(name2 => {
					
					//buttonStyle=
					if (name2.cat_deals != "0") {
						//console.log("hear");

						clickFunction = "startDeal(" + name2.PortionIDcart + ")";

					} else {

						clickFunction = "addToCart(" + name2.Id + ',' + name2.PortionIDcart + ")";
					}

					if (name2.restrict_product != "0") {
						if (name2.cat_deals != "0")
							clickFunction = "confirmAge(" + name2.Id + ',' + name2.PortionIDcart + ",1)";
						else
							clickFunction = "confirmAge(" + name2.Id + ',' + name2.PortionIDcart + ",0)";

					}

					if ((name2.in_stock > 0) || name2.in_stock == 'IN STOCK') {
						displayIcon = '<ons-icon  onclick="' + clickFunction + '" style="color:var(--main-2);font-size: 36px; padding:0px 10px;" icon="fa-plus-circle"></ons-icon>';


					} else {
						clickFunction = 'ons.notification.alert(\'Out of stock\');';
						displayIcon = '<ons-icon  onclick="' + clickFunction + '" style="color:red;font-size: 36px; padding:0px 10px;" icon="fa-times"></ons-icon>';
					}

					// if (name2.old_price != 0)
					// 	priceDisplay = '<span style="text-decoration: line-through;">' + '£' + parseFloat(name2.old_price).toFixed(2) + '</span>' + '£' + parseFloat(name1.price).toFixed(2) + displayIcon;
					// else
					// 	priceDisplay = '£' + parseFloat(name2.price).toFixed(2) + displayIcon;

					//console.log(clickFunction);
					if (name2.image != "")
						imgurl = 'https://live.bb01.net/back/uploads/' + name2.image;
					else
						imgurl = localStorage.getItem("logo_url");
					//			allProducts += ' <ons-col style="text-align:center" width="50%"><img style="width:125px;height:125px;border: 2px #dbdbdb solid;padding: 5px;" src="'+imgurl+'"><p style="margin-top:-133px;margin-left:76px;color:black"><ons-button class="productButton" style="'+buttonStyle+'"  onclick="'+clickFunction+'">'+name1.Name+' '+name1.portionname+'</ons-button></p><p style="margin-top:56px"><ons-button class="productButton" style=";max-width:50%;'+buttonStyle+'"  onclick="'+clickFunction+'"> + £'+parseFloat(name1.price).toFixed(2) + '</ons-button></p><p><ons-icon  onclick="'+clickFunction+'" style="color:#BABFD1;font-size: 36px;" icon="fa-plus-circle"></ons-icon></p>					</ons-col>';

					i++;

					$("#row" + name2.GroupCode).append(
						// '<img src="' + imgurl + '" alt="" srcset="" class="img-thumbnail m-2" onclick="' + clickFunction + '">'
						'<figure class="figure" onclick="' + clickFunction + '">' +
						'<img src="' + imgurl + '" class="figure-img img-fluid rounded img-thumbnail" alt="...">' +
						'<figcaption class="figure-caption text-center">' + name2.Name + '</figcaption>' +
						'</figure>'
					);

					$("#allPro" + name2.GroupCode).append(
						'<li class="list-group-item" onclick="' + clickFunction + '">' + name2.Name + '</li>'
					);


				});
			}
		}
	});

}

function fillDays(toFill2) {
	toFill = JSON.parse(localStorage.getItem('allDays'));
	currBranch = localStorage.getItem('currentBranch');
	maxList = localStorage.getItem('limitOneDay');

	var orderDel = $("input[name='delOrCol']:checked").val();



	toSelect = `<ons-row style="width:50%;display:inline"><form autocomplete="off"><select class="select-input select-input--material" onchange="checkSlots()"; autocomplete="off" id="dateSelect"  style="color: white;font-weight: 600;font-size: 16px;text-align: left;border: 2px solid white;border-width: 0px 0px 2px 0px;margin: 0px 0px 20px 0px;border-radius: 0px;" id="choose-table" class="getTable" >`;
	listBranch2 = document.querySelector('#dateSelect2');
	listBranch2.innerHTML = "";
	show1 = 0
	toFill.forEach(cats => {
		if (cats.branch_id == currBranch && (cats.type == 2 || cats.type == orderDel) && maxList >= show1++) {

			toSelect += `<option style="background-color:#222021;color:white" value="${cats.val}">${cats.show}<\/option>`;
			show1++;

		}
	})
	toSelect += '</select></form></ons-row>';
	listBranch2.appendChild(ons.createElement(toSelect));

}

function checkTiming(getTime) {

	getTime = (typeof getTime === 'undefined') ? 0 : getTime;

	tableSelected = $('#choose-table').find("select").children("option:selected").val();
	if (tableSelected == "noneSelected" && getTime == "x") {
		ons.notification.alert("Please select your table");
		return;
	}

	var orderDel = $("input[name='delOrCol']:checked").val();
	orderType = "After";
	localStorage.setItem("tableSelected", tableSelected);

	var selectDate = $("#dateSelect").val();

	var selectTime = getTime;


	$.ajax({

		url: BASE_URL + '/checkTimingSlots',

		type: "POST",

		crossDomain: true,

		data: 'my-tok=' + localStorage.getItem('myTOK') + '&' + 'order_type=' + orderType + '&order_date=' + selectDate + '&order_time=' + selectTime + '&orderDel=' + orderDel + '&tableSelected=' + tableSelected,

		success: function (resp) {
			localStorage.setItem("myTOK", resp.split('THISTOKEN')[1]);
			resp = resp.split('THISTOKEN')[0];
			if (resp == 'again') {

				ons.notification.alert("Please start again");

				//		startAgain();

				return;



			}

			if (resp == 'd') {
				$('#firstBranchForm').show();
				$('#showGoBack').hide();

				$('#secondBranchForm').hide();
				localStorage.setItem("isDelivery", true);

				setOrderType('d');

			} else if (resp == 'c') {
				$('#firstBranchForm').show();
				$('#showGoBack').hide();

				$('#secondBranchForm').hide();
				localStorage.setItem("isDelivery", false);

				setOrderType('c');

			}


			else {
				ons.notification.alert("Slot not available");
				if ($("#collection").prop("checked"))
					checkSlots(0);
				else
					checkSlots(1);



			}



		},

		error: function (jqXHR) {

			ons.notification.alert("Please start again");


			return;

		}

	});

}

// function btmTab(pos){
// switch (pos) {
// 	case "1":
// 		break;
// 	case "2":
// 		break;
// 	case "3":
// 		break;
// 	case "4":
// 		break;
// }
// }



var onSuccessLoc = function (position) {
	/*    alert('Latitude: '          + position.coords.latitude          + '\n' +
			  'Longitude: '         + position.coords.longitude         + '\n' +
			  'Altitude: '          + position.coords.altitude          + '\n' +
			  'Accuracy: '          + position.coords.accuracy          + '\n' +
			  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
			  'Heading: '           + position.coords.heading           + '\n' +
			  'Speed: '             + position.coords.speed             + '\n' +
			  'Timestamp: '         + position.timestamp                + '\n');*/
	startBranch(0, 0, 1, position.coords.latitude, position.coords.longitude);

};

// onError Callback receives a PositionError object
//
function onErrorLoc(error) {
	alert('code: ' + error.code + '\n' +
		'message: ' + error.message + '\n');
}

function findLoc() {
	navigator.geolocation.getCurrentPosition(onSuccessLoc, onErrorLoc);
}

if (ons.platform.isIPhoneX()) {
	$("ons-bottom-toolbar").css("margin-bottom", "10px")
}



