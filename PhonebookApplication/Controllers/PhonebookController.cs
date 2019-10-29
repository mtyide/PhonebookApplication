using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using PhonebookApplication.Models.Database;

namespace PhonebookApplication.Controllers
{
    public class PhonebookController : ApiController
    {
        private PhonebookEntities db = new PhonebookEntities();

        public IEnumerable<Phonebook> GetPhonebooks()
        {
            return db.Phonebooks.AsEnumerable();
        }

        public HttpResponseMessage PostPhonebook([FromBody] Phonebook phonebook)
        {
            if (ModelState.IsValid)
            {
                if (Exist(phonebook.Name)) { return Request.CreateErrorResponse(HttpStatusCode.Found, ModelState); }

                db.Phonebooks.Add(phonebook);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, phonebook);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = phonebook.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        private bool Exist(string name)
        {
            var result = db.Phonebooks.Where(x => x.Name.Equals(name, StringComparison.OrdinalIgnoreCase)).Count().Equals(0) ? false : true;
            return result;
        }
    }
}