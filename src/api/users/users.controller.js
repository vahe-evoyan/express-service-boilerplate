export function index(req, res) {
  let users = [];
  return res.status(200).json({users});
}
