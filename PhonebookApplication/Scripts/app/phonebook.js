$("#save-phonebook-btn").on("click", function () {
    this.disabled = true;
    $("#save-phonebook-btn").html('Saving...');
    var name = $("#name").val();
    if (name) {
        var data = { Name: name };
        $.post("api/phonebook", data, function (res) {
            $("#modal-task").modal();
            $("#save-phonebook-btn").removeAttr('disabled');
            $("#save-phonebook-btn").html('Save');
            $("#name").val(null);
            $("#name").focus();
            fetchPhoneBooks();
        }, "json").fail(function () {
            $("#name").focus();
            $("#modal-task-failed").modal();
            $("#save-phonebook-btn").removeAttr('disabled');
            $("#save-phonebook-btn").html('Save');
        });
    }
});

$(document).ready(function () {
    fetchPhoneBooks();
});

function fetchPhoneBooks() {
    $("#phonebook-items-header").html('Fetching phonebooks, one moment...');
    $.get("api/phonebook", function (res) {
        $("#phonebook-items-header").html(null);
        var content = '';
        var count = res.length;
        var phonebook = $("#phonebook");
        phonebook.html(null);
        $.each(res, function (key, item) {
            if (key === 0) {
                phonebook.append("<option selected value='" + item.Id + "'>" + item.Name + "</option>");
            } else {
                phonebook.append("<option value='" + item.Id + "'>" + item.Name + "</option>");
            }
            content += '<tr>';
            content += '    <td>'
            content += '        ' + item.Name + '<span class="pull-right"><a style="cursor: pointer;" onclick="fetchPhonebookEntries(' + item.Id + ', null);">Contacts</a></span>';
            content += '    </td>';
            content += '</tr>';
        });
        if (count !== 0) {
            $("#phonebook-items-body").html(content);
            $("#phonebook-items").DataTable({ 'paging': true, 'lengthChange': false, 'searching': false, 'ordering': false, 'info': false, 'autoWidth': true, 'destroy': true, 'retrieve': true });
            $("#phonebook").removeAttr('disabled');
            $("#save-entry-btn").removeAttr('disabled');
            $("#search").removeAttr('disabled');
        } else {
            $("#phonebook-items-body").html('Phonebook is empty. Add new phonebook and <b>Save</b>');
        }
    }, "json").fail(function () {
        $("#phonebook-items-header").html(null);
        $("#modal-task-failed").modal();
    });
}