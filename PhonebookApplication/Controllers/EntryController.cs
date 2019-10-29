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
    public class EntryController : ApiController
    {
        private PhonebookEntities db = new PhonebookEntities();

        public HttpResponseMessage PostEntry([FromBody] Entry entry)
        {
            if (ModelState.IsValid)
            {
                if (Exist(entry.Name, entry.PhoneNumber)) { return Request.CreateErrorResponse(HttpStatusCode.Found, ModelState); }

                db.Entries.Add(entry);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, entry);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = entry.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpDelete]
        public HttpResponseMessage DeleteEntry(int id)
        {
            Entry entry = db.Entries.Find(id);
            if (entry == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Entries.Remove(entry);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, entry);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        private bool Exist(string name, string number)
        {
            var result = db.Entries.Where(x => x.Name.Equals(name, StringComparison.OrdinalIgnoreCase) && x.PhoneNumber.Equals(number)).Count().Equals(0) ? false : true;
            return result;
        }
    }
}