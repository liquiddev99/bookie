import { useEffect } from "react";
import { withRouter } from "react-router-dom";

const AutoScrollToTop = ({ history }) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);
  return null;
};

export default withRouter(AutoScrollToTop);
