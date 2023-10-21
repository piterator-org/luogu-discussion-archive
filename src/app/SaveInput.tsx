export default function SaveInput() {
  return (
    <form
      className="input-group input-group-lg mx-auto"
      style={{ maxWidth: "40em" }}
    >
      <input
        className="form-control shadow-bssb rounded-start-4 border-0"
        autoComplete="off"
        placeholder="帖子链接或编号"
        disabled
      />
      <button
        className="btn btn-secondary rounded-end-4 shadow-bssb"
        type="submit"
        disabled
      >
        立即保存
      </button>
    </form>
  );
}
