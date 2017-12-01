if(Ext.define){
    Ext.define('FormLibrary', {
        singleton : true,
        requires:[
            'resources.js.forms.Gallery',
            'resources.js.forms.Html',
            'resources.js.forms.ImageList',
            'resources.js.forms.Information',
            'resources.js.forms.Normal',
            'resources.js.forms.SimpleList',
			'resources.js.forms.Quotation'
        ],
        config:{
            name:'FormLibrary'
        },
        constructor:function(config){
            this.initConfig(config);
            this.setViewer();
        },
        getApp:function(){
            return Actor;
        },
        setViewer:function(){
            this.FORMS.push(resources.js.forms.Gallery);
            this.FORMS.push(resources.js.forms.Html);
            this.FORMS.push(resources.js.forms.ImageList);
            this.FORMS.push(resources.js.forms.Information);
            this.FORMS.push(resources.js.forms.Normal);
            this.FORMS.push(resources.js.forms.SimpleList);
			this.FORMS.push(resources.js.forms.Quotation);
        },
        FORMS:[]
    });
}