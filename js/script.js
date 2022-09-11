document.querySelector("#date").textContent = new Date().getFullYear();

(function ($) {
  "use strict";

  $(".contact-form").validate({
    submitHandler: function (form) {
      var $form = $(form),
        $messageSuccess = $form.find(".contact-form-success"),
        $messageError = $form.find(".contact-form-error"),
        $submitButton = $(this.submitButton),
        $errorMessage = $form.find(".mail-error-message"),
        submitButtonText = $submitButton.val();
      $submitButton
        .val(
          $submitButton.data("loading-text")
            ? $submitButton.data("loading-text")
            : "Loading..."
        )
        .attr("disabled", true);
      var formData = $form.serializeArray(),
        data = {};

      $(formData).each(function (index, obj) {
        if (data[obj.name]) {
          data[obj.name] = data[obj.name] + ", " + obj.value;
        } else {
          data[obj.name] = obj.value;
        }
      });

      $.ajax({
        type: "POST",
        url: "https://script.google.com/macros/s/AKfycbxIGKQ0X_iOhs6eWlrc7IT_-qQCeQKabdXdeuolz75RZk6gIhlqIsCvTQZWegHmu48z2A/exec",
        data: data,
      }).always(function (data, textStatus, jqXHR) {
        console.log(data);
        $errorMessage.empty().hide();
        if (data.result == "success") {
          $messageSuccess.removeClass("d-none");
          $messageError.addClass("d-none");
          $form
            .find(".form-control")
            .val("")
            .blur()
            .parent()
            .removeClass("has-success")
            .removeClass("has-danger")
            .find("label.error")
            .remove();
          if ($messageSuccess.offset().top - 80 < $(window).scrollTop()) {
            $("html, body").animate(
              { scrollTop: $messageSuccess.offset().top - 80 },
              300
            );
          }
          $form.find(".form-control").removeClass("error");
          $submitButton.val(submitButtonText).attr("disabled", false);
          return;
        } else if (
          data.result == "error" &&
          typeof data.errorMessage !== "undefined"
        ) {
          $errorMessage.html(data.errorMessage).show();
        } else {
          $errorMessage.html(data.responseText).show();
        }
        $messageError.removeClass("d-none");
        $messageSuccess.addClass("d-none");
        if ($messageError.offset().top - 80 < $(window).scrollTop()) {
          $("html, body").animate(
            { scrollTop: $messageError.offset().top - 80 },
            300
          );
        }
        $form.find(".has-success").removeClass("has-success");
        $submitButton.val(submitButtonText).attr("disabled", false);
      });
    },
  });
}.apply(this, [jQuery]));
