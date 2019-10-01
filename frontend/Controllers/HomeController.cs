using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;
using System.IO;
using Frontend.Models;

namespace Frontend.Controllers
{
	public class HomeController : Controller
	{
		// https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/
		private static readonly HttpClient client = new HttpClient();
		private readonly AppConfig config;

		public HomeController(AppConfig config)
		{
			this.config = config ?? throw new ArgumentNullException(nameof(config));
		}

		public IActionResult Index()
		{
			return View();
		}

		[HttpGet("Report/{*pathInfo}")]
		public async Task<ActionResult> Report(string pathInfo)
		{
			string url = $"/{pathInfo}";

			string body = JsonConvert.SerializeObject(new { url });
			using StringContent jsonBody = new StringContent(body, Encoding.UTF8, "application/json");
			using HttpRequestMessage request = new HttpRequestMessage
			{
				RequestUri = new Uri(config.MiddletierUrl),
				Method = HttpMethod.Post
			};
			request.Content = jsonBody;
			if (this.Request.Headers.ContainsKey("azds-route-as"))
			{
				// Propagate the dev space routing header
				request.Headers.Add("azds-route-as", this.Request.Headers["azds-route-as"] as IEnumerable<string>);
			}
			HttpResponseMessage response = await client.SendAsync(request);
			response.EnsureSuccessStatusCode();
			Stream stream = await response.Content.ReadAsStreamAsync();

			return new FileStreamResult(stream, new MediaTypeHeaderValue("application/pdf")); /* to download: {FileDownloadName = filename}; */
		}

	}
}
