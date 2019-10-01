using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
	public class HomeController : Controller
	{

		public IActionResult Index()
		{
			return View();
		}

		[HttpGet("report")]
		public IActionResult Report()
		{
			return View();
		}

		[HttpGet("warnings")]
		public IActionResult Warnings()
		{
			return View();
		}

	}
}
