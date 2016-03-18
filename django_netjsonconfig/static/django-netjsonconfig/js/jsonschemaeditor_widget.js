(function ($) {
    var loadUi = function(backend, schemas){
        $('.jsoneditor-raw').each(function(i, el){
            var field = $(el),
                form = field.parents('form').eq(0),
                value = JSON.parse(field.val()),
                id = field.attr('id') + '_jsoneditor',
                container = field.parents('.form-row').eq(0),
                labelText = container.find('label').text(),
                startval = $.isEmptyObject(value) ? null : value,
                editorContainer = $('#' + id),
                html, editor, options, wrapper, header;
            // inject editor unless already present
            if(!editorContainer.length){
                html =  '<div class="jsoneditor-wrapper">';
                html += '<fieldset class="module aligned"><h2>'+ labelText +'</h2>';
                html += '<div id="'+ id +'" class="jsoneditor"></div></fieldset>';
                html += '</div>';
                container.hide().after(html);
                editorContainer = $('#' + id);
            }
            else{
                editorContainer.html('');
            }
            wrapper = editorContainer.parents('.jsoneditor-wrapper');
            options = {
                theme: 'django',
                disable_collapse: true,
                disable_edit_json: true,
                startval: startval,
                keep_oneof_values: false,
                // if no backend selected use empty schema
                schema: backend ? schemas[backend] : {}
            }
            editor = new JSONEditor(document.getElementById(id), options);
            updateRaw = function(){
                field.val(JSON.stringify(editor.getValue(), null, 4));
            };
            // update raw value on change event
            editor.on('change', updateRaw);
            // update raw value before form submit
            form.on('submit', function(){
                if (container.is(':hidden')) { updateRaw() }
            });
            // add advanced edit button
            header = editorContainer.find('> div > h3');
            header.find('span:first-child').hide();  // hides "root"
            header.attr('class', 'controls')
            // move advanced mode button in auto-generated UI
            container.find('.advanced-mode').prependTo(header);
            // advanced mode & normal mode buttons
            header.find('.advanced-mode').click(function(){
                wrapper.hide();
                container.show();
            });
            container.find('.normal-mode').click(function(){
                // update autogenerated UI
                editor.setValue(JSON.parse(field.val()));
                container.hide();
                wrapper.show();
            });
        });
    };
    $(function() {
        $.getJSON(django._netjsonconfigSchemaUrl).success(function(schemas){
            var backend = $('#id_backend'),
                reload = function(){ loadUi(backend.val(), schemas) };
            // load first time
            reload();
            // reload when backend is changed
            backend.change(reload);
        })
    });
})(django.jQuery);

// JSON-Schema Edtor django theme
JSONEditor.defaults.themes.django = JSONEditor.AbstractTheme.extend({
    getContainer: function() {
        return document.createElement('div');
    },
    getFloatRightLinkHolder: function() {
        var el = document.createElement('div');
        el.style = el.style || {};
        el.style.cssFloat = 'right';
        el.style.marginLeft = '10px';
        return el;
    },
    getModal: function() {
        var el = document.createElement('div');
        el.className = 'modal';
        el.style.display = 'none';
        return el;
    },
    getGridContainer: function() {
        var el = document.createElement('div');
        el.className = 'grid-container';
        return el;
    },
    getGridRow: function() {
        var el = document.createElement('div');
        el.className = 'grid-row';
        return el;
    },
    getGridColumn: function() {
        var el = document.createElement('div');
        el.className = 'grid-column';
        return el;
    },
    setGridColumnSize: function(el, size) {
        return el;
    },
    getLink: function(text) {
        var el = document.createElement('a');
        el.setAttribute('href', '#');
        el.appendChild(document.createTextNode(text));
        return el;
    },
    disableHeader: function(header) {
        header.style.color = '#ccc';
    },
    disableLabel: function(label) {
        label.style.color = '#ccc';
    },
    enableHeader: function(header) {
        header.style.color = '';
    },
    enableLabel: function(label) {
        label.style.color = '';
    },
    getFormInputLabel: function(text) {
        var el = document.createElement('label');
        el.appendChild(document.createTextNode(text));
        return el;
    },
    getCheckboxLabel: function(text) {
        var el = this.getFormInputLabel(text);
        return el;
    },
    getHeader: function(text) {
        var el = document.createElement('h3');
        if (typeof text === "string") {
            el.textContent = text;
        } else {
            el.appendChild(text);
        }
        return el;
    },
    getCheckbox: function() {
        var el = this.getFormInputField('checkbox');
        el.style.display = 'inline-block';
        el.style.width = 'auto';
        return el;
    },
    getMultiCheckboxHolder: function(controls, label, description) {
        var el = document.createElement('div');

        if (label) {
            label.style.display = 'block';
            el.appendChild(label);
        }

        for (var i in controls) {
            if (!controls.hasOwnProperty(i)) continue;
            controls[i].style.display = 'inline-block';
            controls[i].style.marginRight = '20px';
            el.appendChild(controls[i]);
        }

        if (description) el.appendChild(description);

        return el;
    },
    getSelectInput: function(options) {
        var select = document.createElement('select');
        if (options) this.setSelectOptions(select, options);
        return select;
    },
    getSwitcher: function(options) {
        var switcher = this.getSelectInput(options);
        switcher.className = 'switcher';
        return switcher;
    },
    getSwitcherOptions: function(switcher) {
        return switcher.getElementsByTagName('option');
    },
    setSwitcherOptions: function(switcher, options, titles) {
        this.setSelectOptions(switcher, options, titles);
    },
    setSelectOptions: function(select, options, titles) {
        titles = titles || [];
        select.innerHTML = '';
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', options[i]);
            option.textContent = titles[i] || options[i];
            select.appendChild(option);
        }
    },
    getTextareaInput: function() {
        var el = document.createElement('textarea');
        el.className = 'vLargeTextField';
        return el;
    },
    getRangeInput: function(min, max, step) {
        var el = this.getFormInputField('range');
        el.setAttribute('min', min);
        el.setAttribute('max', max);
        el.setAttribute('step', step);
        return el;
    },
    getFormInputField: function(type) {
        var el = document.createElement('input');
        el.className = 'vTextField';
        el.setAttribute('type', type);
        return el;
    },
    afterInputReady: function(input) {

    },
    getFormControl: function(label, input, description) {
        var el = document.createElement('div');
        el.className = 'form-row'
        if (label) el.appendChild(label);
        if (input.type === 'checkbox') {
            label.insertBefore(input, label.firstChild);
        } else {
            el.appendChild(input);
        }
        if (description) el.appendChild(description);
        return el;
    },
    getIndentedPanel: function() {
        var el = document.createElement('div');
        el.className = 'inline-related';
        return el;
    },
    getChildEditorHolder: function() {
        var el = document.createElement('div');
        el.className = 'inline-group';
        return el;
    },
    getDescription: function(text) {
        var el = document.createElement('p');
        el.innerHTML = text;
        return el;
    },
    getCheckboxDescription: function(text) {
        return this.getDescription(text);
    },
    getFormInputDescription: function(text) {
        return this.getDescription(text);
    },
    getHeaderButtonHolder: function() {
        var el = document.createElement('span');
        el.className = 'control';
        return el;
    },
    getButtonHolder: function() {
        var el = document.createElement('div');
        el.className = 'control';
        return el;
    },
    getButton: function(text, icon, title) {
        var el = document.createElement('input'),
            className = 'button';
        if (text.indexOf('Delete') > -1) {
            className += ' deletelink';
        }
        el.className = className;
        el.type = 'button';
        this.setButtonText(el, text, icon, title);
        return el;
    },
    setButtonText: function(button, text, icon, title) {
        button.value = text;
        if (title) button.setAttribute('title', title);
    },
    getTable: function() {
        return document.createElement('table');
    },
    getTableRow: function() {
        return document.createElement('tr');
    },
    getTableHead: function() {
        return document.createElement('thead');
    },
    getTableBody: function() {
        return document.createElement('tbody');
    },
    getTableHeaderCell: function(text) {
        var el = document.createElement('th');
        el.textContent = text;
        return el;
    },
    getTableCell: function() {
        var el = document.createElement('td');
        return el;
    },
    getErrorMessage: function(text) {
        var el = document.createElement('p');
        el.style = el.style || {};
        el.style.color = 'red';
        el.appendChild(document.createTextNode(text));
        return el;
    },
    addInputError: function(input, text) {},
    removeInputError: function(input) {},
    addTableRowError: function(row) {},
    removeTableRowError: function(row) {},
    getTabHolder: function() {
        var el = document.createElement('div');
        el.innerHTML = "<div style='float: left; width: 130px;' class='tabs'></div><div class='content' style='margin-left: 130px;'></div><div style='clear:both;'></div>";
        return el;
    },
    applyStyles: function(el, styles) {
        el.style = el.style || {};
        for (var i in styles) {
            if (!styles.hasOwnProperty(i)) continue;
            el.style[i] = styles[i];
        }
    },
    closest: function(elem, selector) {
        while (elem && elem !== document) {
            if (matchKey) {
                if (elem[matchKey](selector)) {
                    return elem;
                } else {
                    elem = elem.parentNode;
                }
            } else {
                return false;
            }
        }
        return false;
    },
    getTab: function(span) {
        var el = document.createElement('div');
        el.appendChild(span);
        el.style = el.style || {};
        this.applyStyles(el, {
            border: '1px solid #ccc',
            borderWidth: '1px 0 1px 1px',
            textAlign: 'center',
            lineHeight: '30px',
            borderRadius: '5px',
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            fontWeight: 'bold',
            cursor: 'pointer'
        });
        return el;
    },
    getTabContentHolder: function(tab_holder) {
        return tab_holder.children[1];
    },
    getTabContent: function() {
        return this.getIndentedPanel();
    },
    markTabActive: function(tab) {
        this.applyStyles(tab, {
            opacity: 1,
            background: 'white'
        });
    },
    markTabInactive: function(tab) {
        this.applyStyles(tab, {
            opacity: 0.5,
            background: ''
        });
    },
    addTab: function(holder, tab) {
        holder.children[0].appendChild(tab);
    },
    getBlockLink: function() {
        var link = document.createElement('a');
        link.style.display = 'block';
        return link;
    },
    getBlockLinkHolder: function() {
        var el = document.createElement('div');
        return el;
    },
    getLinksHolder: function() {
        var el = document.createElement('div');
        return el;
    },
    createMediaLink: function(holder, link, media) {
        holder.appendChild(link);
        media.style.width = '100%';
        holder.appendChild(media);
    },
    createImageLink: function(holder, link, image) {
        holder.appendChild(link);
        link.appendChild(image);
    }
});