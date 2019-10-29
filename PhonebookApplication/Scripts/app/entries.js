$("#search").keypress(function () {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        $("#search").attr('disabled', 'disabled');
        var search = $("#search").val();
        if (search) {
            fetchPhonebookEntries(null, search);
        }
        $("#search").removeAttr('disabled');
    }
});

$("#save-entry-btn").on("click", function () {
    this.disabled = true;
    $("#save-entry-btn").html('Saving...');
    var name = $("#contactname").val();
    var phonenumber = $("#phonenumber").val();
    if (name && phonenumber) {
        var phonebookId = parseInt($("#phonebook").val());
        var data = { Name: name, PhoneNumber: phonenumber, PhonebookId: phonebookId };
        $.post("api/entry", data, function (res) {
            $("#modal-task").modal();
            $("#save-entry-btn").removeAttr('disabled');
            $("#save-entry-btn").html('Save');
            $("#contactname").val(null);
            $("#phonenumber").val(null);
            $("#contactname").focus();
            fetchPhonebookEntries(phonebookId, null);
        }, "json").fail(function () {
            $("#contactname").focus();
            $("#modal-task-failed").modal();
            $("#save-entry-btn").removeAttr('disabled');
            $("#save-entry-btn").html('Save');
        });
    }
});

function fetchPhonebookEntries(id, search) {
    $("#entry-items-header").html('Fetching contacts, one moment...');
    var data = { id: id, search: search }
    $.post("api/search/entry", data, function (res) {
        $("#entry-items-header").html(null);
        var content = '';
        var count = res.length;
        $.each(res, function (key, item) {
            content += '<tr>';
            content += '    <td>'
            content += '        ' + item.Name;
            content += '    </td>';
            content += '    <td>'
            content += '        ' + item.PhoneNumber
            content += '    </td>';
            if (id > 0) {
                content += '    <td>'
                content += '        <span class="pull-right"><a style="cursor: pointer;" onclick="deletePhonebookEntry(' + item.Id + ', ' + id + ');">Delete</a></span>';
                content += '    </td>';
            }
            content += '</tr>';
        });
        if (count !== 0) {
            $("#entry-items-body").html(content);
            $("#entry-items").DataTable({ 'paging': true, 'lengthChange': false, 'searching': false, 'ordering': false, 'info': false, 'autoWidth': true, 'destroy': true, 'retrieve': true });
        } else {
            $("#entry-items-body").html('Phonebook is empty. Add new entry and <b>Save</b>');
        }
        if (id > 0) {
            $("#phonebook").val(id);
            $("#save-entry-btn").removeAttr('disabled');
        }
    }, "json").fail(function () {
        $("#entry-items-header").html(null);
        $("#contactname").focus();
        $("#modal-task-failed").modal();
        $("#save-entry-btn").removeAttr('disabled');
        $("#save-entry-btn").html('Save');
    });
}

function deletePhonebookEntry(id, phonebookId) {
    $("#entry-items-header").html('Deleting...');
    var uri = "api/entry/" + id;
    $.ajax({
        type: "DELETE",
        url: uri,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            $("#modal-task").modal();
            fetchPhonebookEntries(phonebookId, null);
        },
        error: function () {
            $("#entry-items-header").html(null);
            $("#modal-task-failed").modal();
        }
    });
}

function toggle(anchor, div, show) {
    if (show === false) {
        anchor.html('Show');
        div.fadeOut();
        anchor.attr('onclick', 'toggle($(this), $("#phonebook-entry"), true);');
    } else {
        anchor.html('Hide');
        div.fadeIn();
        anchor.attr('onclick', 'toggle($(this), $("#phonebook-entry"), false);');
    }
}
