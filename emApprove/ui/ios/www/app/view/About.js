/**
 * Copyright 2012-2013 Electronic Arts, Inc. 
 */
/* About page of the ERP Application*/
Ext.define('eaApprove.view.About', {
    extend: 'Ext.Container',
    alias: 'widget.about',
    id: 'about',
    config: {
        title: 'About',
        scrollable: {
            direction: 'vertical'
        },
           height:'100%',
        items: [
        // About page contents in HTML.
		{
		   xtype:'toolbar',
		   id:'aboutviewtoolbar',
		   docked:'top',
		   title:'About',
		   items:[
		   {
		       xtype:'button',
		       ui:'back',
		       id:'aboutviewback',
			   text:'Back',
		        handler: function () {
                    
                    this.fireEvent('onAboutViewBack', this);
                },
			}	
		   ]
		},
        {
            xtype: 'panel',
            name: 'image',
            height:720,
            html: '<br><p class="AboutPara">This mobile app is built using open source technologies - Sencha Touch and PhoneGap. Sencha Touch is a high-performance HTML5 mobile application framework. Built for enabling world-class user experiences, Sencha Touch enables developers to build fast and impressive apps that work on iOS, Android and Windows Phone 8. PhoneGap was used to provide access to device native features and wrap the HTML5 application.</p><p class="AboutPara">The server is built using Node.js, a platform built on Chrome JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.</p><br></p><p class="AboutPara"><a target="_blank" href="http://www.sencha.com/products/touch">https://www.sencha.com/products/touch</a><br><a target="_blank" href="http://www.phonegap.com">http://www.phonegap.com</a><br><a target="_blank" href="http://nodejs.org">http://nodejs.org</a><br></p><div   class="logofont"><center ><img class="imgea" src="resources/images/eaabout.png"  ></img><br>emApprove<br>Version 1.1 Beta<br><br>TM & &#169; 2012-2013 Electronic Arts Inc.<br>All Rights Reserved.</center><br></div>',
        }, ],
    },
});