/*
*
	The following plugin manages the defaults on a Single Page Configurator. It does *not* assume React-Wilcox
	is being used, and is compatible with a pure JQuery plugin. 

	Author: Zachary Ringwood
	
	DEPENDENCIES: 
	None. The load method returns some HTML that can be added to any HTML file, but the methods don't rely
	on that HTML being present. 
	
	HOW TO USE:
	The defaults are saved to CO_DES_DEFAULTS in JSON format. The JSON parses to a nested object containing 
	select, text and radio keys. Each of these object contain key / values pairs such that the key is the ID 
	of the input and the value is the value of the input. 
	Calling "applyDefaults" will ONLY return the JSON to the front end. Loading in the values to 
	a configurator and firing the logic is left to the discretion of the end user. 
	
	Changelog:
	2025/10/22: Added Preface. 
*/

const DEFAULTS_PLUGIN = {
  load: (productID) => {

    if (!document.getElementById('defaults-plugin-styles')) {

        const style = document.createElement('style');
        style.id = 'defaults-plugin-styles';

        style.innerHTML = `

			
		#DEFAULTS_PLUGIN {
    			width: 100%;
    			display: block;
		}

            #DEFAULTS_PLUGIN .defaults-plugin-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-top: 10px;
            }

            #DEFAULTS_PLUGIN .defaults-button {
                display: flex;
                align-items: center;
                gap: 6px;

                cursor: pointer;
                user-select: none;

                color: #000;
                text-decoration: none;

                font-size: 12px;
                font-weight: 600;
                line-height: 1;
            }

            #DEFAULTS_PLUGIN .defaults-button i {
                font-size: 14px;
                color: #000;
                line-height: 1;
                width: 14px;
                text-align: center;
            }

		  #DEFAULTS_PLUGIN .defaults-button .fas:before,
		  #DEFAULTS_PLUGIN .defaults-button .far:before{
			font-size: 12px;
		  }

            #DEFAULTS_PLUGIN .defaults-button span {
                font-size: 14px;
                font-weight: 600;
                color: #000;
                line-height: 1;
                white-space: nowrap;
            }

            #DEFAULTS_PLUGIN .defaults-button:hover {
                opacity: 0.7;
            }
        `;

        document.head.appendChild(style);
    }

    return `
        <div class="defaults-plugin-container">

            <div
                onclick="DEFAULTS_PLUGIN.setNewDefaults('${productID}')"
                class="defaults-button">

                <i class="far fa-bookmark"></i>
                <span>Save as Default</span>

            </div>

            <div
                id="LOAD_DEFAULTS"
                class="defaults-button">

                <i class="fas fa-undo"></i>
                <span>Restore Default</span>

            </div>

        </div>
    `;
},
 hasBeenConfigured:(productid, designid) => {
   $.ajax({
    url:`/spr/custom/jpoc/json/849871261?exists=${designid}`
  }).done(res => {
  return res[0].VALID
	
  }).fail(res => {
    simpleConfirm('No Defaults Found')
  })
},
 applyDefaults : (productid, inputCallback) => {
  return new Promise((resolve, reject) => {
     $.ajax({
    url:`/spr/custom/jpoc/json/849871261?${productid}`
  }).done(res => {
	if(!res)
	  return;
   const inputs = JSON.parse(res.INPUT_SETTINGS)
   
   inputCallback(inputs)
	  resolve(res)
  }).fail(res => {
    reject(res)
  })
  })
 
},
 setNewDefaults : (productID) =>{
   
   
  const obj = {}
  
  const select = {}
  $('#configurator').find('select[ignore!=true]').each((index, input) => {
    if(input.getAttribute("id") === "OPERATOR"){
	 console.log(input)
    }
    if(!!input.getAttribute("id"))
    select[input.getAttribute("id")] = input.value
  })
 obj['select'] = select
   const text = {}
   $('#configurator').find('input[ignore!=true][type="text"], input[ignore!=true][type=number]').each((index, input) => {
    if(!!input.getAttribute("id"))
    text[input.getAttribute("id")] = input.value
  })
   obj['text'] = text
   
   const radio = {}
   $('#configurator').find('input[ignore!=true][type="radio"]:checked').each((index, input) => {
    	radio[input.getAttribute("name")] = input.value
  })
  obj['radio'] = radio
  const dataobject = {
    PRODUCT_ID:productID,
    INPUT_SETTINGS:obj,
  }
	
  $.ajax({
    url:`/spr/custom/jpoc/json/849871261`,
    type:"POST",
    data:JSON.stringify(dataobject),
    contentType: 'application/json; charset=utf-8',
    error: function(err, textStatus, errorThrown) {
    console.log(err, textStatus, errorThrown)
    simpleConfirm('Error, new defaults not saved.')
  }
  }).done(res => {
    simpleConfirm('New Defaults Saved')
  })
}
}

