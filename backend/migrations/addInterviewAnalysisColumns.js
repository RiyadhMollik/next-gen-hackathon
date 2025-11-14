import { DataTypes } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.addColumn('interviews', 'integrityReport', {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Interview integrity monitoring report with fraud detection data'
  });

  await queryInterface.addColumn('interviews', 'behaviorReport', {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Behavioral analysis report with AI-generated insights'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('interviews', 'integrityReport');
  await queryInterface.removeColumn('interviews', 'behaviorReport');
};
