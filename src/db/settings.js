const { eq, or } = require("drizzle-orm");

const { db } = require(".");
const { settingsTable } = require("./schema");

exports.getSMTPConfig = async () => {
  try {
    const settings = await db
      .select()
      .from(settingsTable)
      .where(
        or(
          eq(settingsTable.key, "smtp_host"),
          eq(settingsTable.key, "smtp_port"),
          eq(settingsTable.key, "smtp_user"),
          eq(settingsTable.key, "smtp_pass"),
          eq(settingsTable.key, "smtp_secure")
        )
      );

    const smtpHost = settings.find(({ key }) => key === "smtp_host")?.value;
    const smtpPort = settings.find(({ key }) => key === "smtp_port")?.value;
    const smtpUser = settings.find(({ key }) => key === "smtp_user")?.value;
    const smtpPass = settings.find(({ key }) => key === "smtp_pass")?.value;
    const smtpSecure = settings.find(({ key }) => key === "smtp_secure")?.value;

    return {
      success: true,
      config: {
        smtpHost: smtpHost ?? null,
        smtpPort: smtpPort ?? null,
        smtpUser: smtpUser ?? null,
        smtpPass: smtpPass ?? null,
        smtpSecure: smtpSecure ? smtpSecure === "true" : null,
      },
    };
  } catch (error) {
    return {
      success: false,
      config: {
        smtpHost: null,
        smtpPort: null,
        smtpUser: null,
        smtpPass: null,
        smtpSecure: null,
      },
    };
  }
};

exports.updateSMTPConfig = async ({
  smtpHost,
  smtpPort,
  smtpUser,
  smtpPass,
  smtpSecure,
}) => {
  try {
    await db.delete(settingsTable);
    await db.insert(settingsTable).values([
      { key: "smtp_host", value: smtpHost },
      { key: "smtp_port", value: smtpPort },
      { key: "smtp_user", value: smtpUser },
      { key: "smtp_pass", value: smtpPass },
      { key: "smtp_secure", value: smtpSecure ? "true" : "false" },
    ]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
