package com.configureone.api.plugin.CS;

import java.util.List;

import com.configureone.api.configuration.*;
import com.configureone.api.core.Concept;

import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 * Generated Java Class Skeleton for JPoC type = BRBOM (extends
 * com.configureone.api.configuration.JpocConfigurationBuildRulesBom)
 * Generation 3
 * 
 * @date Thu Jun 11 12:50:15 EDT 2026
 * @author Charmi Surati (charmi.surati)
 * @version 1.0
 * @file UpdateUDFController.java
 *
 *       Put comments about your JPoC here.
 *
 *       Ew log Link
 *       https://easywebdev.rwdoors.com/HTML/logs/ConceptManager1/ConceptManager_API.log
 */
public class UpdateUDFController extends com.configureone.api.configuration.JpocConfigurationBuildRulesBom {

	String[] glzCodes;
	String[] cncCodes;
	String[] scCodes;

	int scIndex = 0;

	@Override
	public java.lang.Void execute() {

		try {

			// getLogger().info("UpdateUDFController");
			Configuration configuration = getConfiguration();
			String productId = configuration.getProduct().getId();
			getLogger().info(productId);

			if ("162059085".equals(productId)) {
				// String a = configuration.getInputByName("CNC");
				Item bom = configuration.getBillOfMaterial();

				glzCodes = new String[] {
						configuration.getInputByName("GLZ_CODE_SECTION_01").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_02").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_03").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_04").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_05").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_06").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_07").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_08").getValue().getStringValue(),
						configuration.getInputByName("GLZ_CODE_SECTION_09").getValue().getStringValue()
				};

				cncCodes = new String[] {
						configuration.getInputByName("CNC_SECTION_01").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_02").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_03").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_04").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_05").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_06").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_07").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_08").getValue().getStringValue(),
						configuration.getInputByName("CNC_SECTION_09").getValue().getStringValue()
				};

				scCodes = new String[] {
						configuration.getInputByName("SECTION_01_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_02_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_03_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_04_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_05_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_06_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_07_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_08_SC_CODE").getValue().getStringValue(),
						configuration.getInputByName("SECTION_09_SC_CODE").getValue().getStringValue()
				};

				// Traverse entire BOM tree
				findSCParts(bom);

			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public void findSCParts(Item item) {

		if (item.getBomItemMaster() != null) {

			String partNumber = item.getBomItemMaster().getSmartPartNumber();

			if (partNumber != null && partNumber.startsWith("SC")) {

				int section = getSectionFromPart(partNumber);

				if (section > 0 && section <= glzCodes.length) {

					String glz = glzCodes[section - 1];
					String cnc = cncCodes[section - 1];
					String sc = scCodes[section - 1];

					getLogger().info(
							"Matched Part: " + partNumber +
									" → Section(from SC138XX): " + section +
									" | GLZ=" + glz +
									" | CNC=" + cnc +
									" | SC=" + sc);

					updateUDF(partNumber, glz, cnc, sc);

				} else {
					getLogger().warn("Invalid section derived from: " + partNumber);
				}
			}
		}

		// recurse
		List<Item> children = item.getChildren();
		if (children != null) {
			for (Item child : children) {
				findSCParts(child);
			}
		}
	}

	private void updateUDF(String partNumber, String glz, String cnc, String sc) {

		try (Connection connection = Concept.getInstance()
				.getFactory()
				.getDatabaseConnectionPool()
				.getConnection()) {

			String updateQuery = "UPDATE CO_ITEM_MASTER_UDF " +
					"SET var_33 = ?, var_34 = ?, var_35 = ? " +
					"WHERE SMARTPART_NUM = ?";

			try (PreparedStatement stmt = connection.prepareStatement(updateQuery)) {

				stmt.setString(1, sc != null ? sc : "");
				stmt.setString(2, cnc != null ? cnc : "");
				stmt.setString(3, glz != null ? glz : "");
				stmt.setString(4, partNumber);

				int rows = stmt.executeUpdate();

				getLogger().info(
						"Updated: " + partNumber +
								" | SC=" + sc +
								" | CNC=" + cnc +
								" | GLZ=" + glz +
								" | Rows=" + rows);

			}

		} catch (Exception e) {
			getLogger().error("Error updating UDF for part: " + partNumber, e);
		}
	}

	private int getSectionFromPart(String partNumber) {
		try {
			// Split by "-"
			String firstPart = partNumber.split("-")[0]; // SC13803

			// Take last 2 digits
			String lastTwoDigits = firstPart.substring(firstPart.length() - 2); // "03"

			return Integer.parseInt(lastTwoDigits); // → 3

		} catch (Exception e) {
			getLogger().error("Failed to extract section from part: " + partNumber, e);
		}
		return -1;
	}

}
