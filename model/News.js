module.exports = (sequelize, DataTypes) => {
  class News extends DataTypes.Model {}

  News.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    publishedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'News'
  });

  return News;
}
