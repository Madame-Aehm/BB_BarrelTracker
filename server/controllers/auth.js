export function createAuthControllers({ authService }) {
  const authenticateDevice = async (req, res) => {
    const result = await authService.authenticateWithPin(req.body.pin);
    res.status(200).json(result);
  };

  const currentlyAuthorized = (_, res) => {
    res.status(200).json(true);
  };

  const refreshAuth = async (req, res) => {
    const { refreshToken, sessionId } = req.body ?? {};
    const result = await authService.refreshTokens(refreshToken, sessionId);
    res.status(200).json(result);
  };

  const logout = async (req, res) => {
    const { sessionId } = req.body ?? {};
    const result = await authService.logout(sessionId);
    res.status(200).json(result);
  };

  const recoverPin = async (_, res) => {
    const result = await authService.startPinRecovery();
    res.status(200).json(result);
  };

  const changePin = async (req, res) => {
    const { newPin, recoveryCode } = req.body;
    const result = await authService.changePin(newPin, recoveryCode);
    res.status(200).json(result);
  };

  return {
    authenticateDevice,
    currentlyAuthorized,
    refreshAuth,
    logout,
    recoverPin,
    changePin,
  };
}
