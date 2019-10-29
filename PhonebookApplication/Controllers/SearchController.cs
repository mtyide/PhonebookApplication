using PhonebookApplication.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PhonebookApplication.Controllers
{
    public class SearchController : ApiController
    {
        private PhonebookEntities db = new PhonebookEntities();

        [HttpPost]
        public HttpResponseMessage Entry([FromBody] Query query)
        {
            var entries = db.SearchPhonebook(query.Search, query.Id);
            var list = new List<Entry>();
            foreach (var item in entries.ToList())
            {
                list.Add(new Entry
                {
                    Id = item.Id,
                    Name = item.Name,
                    PhoneNumber = item.PhoneNumber,
                    PhonebookId = item.PhonebookId
                });
            }
            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        #region Helper Classes
        public class Query
        {
            public Query() { }
            public int Id { get; set; }
            public string Search { get; set; }
        }
        #endregion
    }
}
