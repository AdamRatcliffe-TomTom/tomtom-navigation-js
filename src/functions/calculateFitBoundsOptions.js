import {
  FIT_BOUNDS_PADDING_TOP,
  FIT_BOUNDS_PADDING_RIGHT,
  FIT_BOUNDS_PADDING_BOTTOM,
  FIT_BOUNDS_PADDING_LEFT,
  TABLET_PANEL_WIDTH
} from "../config";

const calculateFitBoundsOptions = ({
  isPhone,
  guidancePanelHeight,
  bottomPanelHeight,
  safeAreaInsets,
  animate
}) => ({
  padding: {
    top: isPhone
      ? guidancePanelHeight + safeAreaInsets.top + 48
      : FIT_BOUNDS_PADDING_TOP,
    right: FIT_BOUNDS_PADDING_RIGHT,
    bottom: isPhone ? bottomPanelHeight + 24 : FIT_BOUNDS_PADDING_BOTTOM,
    left: isPhone
      ? FIT_BOUNDS_PADDING_LEFT
      : TABLET_PANEL_WIDTH + FIT_BOUNDS_PADDING_LEFT
  },
  animate
});

export default calculateFitBoundsOptions;
