package engineeringthesis.configuration;

import org.hibernate.cfg.AvailableSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = {"engineeringthesis.model"})
public class JpaConfig {
    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setUrl(datasourceUrl);
        driverManagerDataSource.setUsername(username);
        driverManagerDataSource.setPassword(password);

        return driverManagerDataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(false);
        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("engineeringthesis.model");
        factory.setJpaProperties(getHibernateProperties());
        factory.setDataSource(dataSource());
        return factory;
    }

    private Properties getHibernateProperties() {
        Properties ps = new Properties();
        ps.put("hibernate.temp.use_jdbc_metadata_defaults", "false");
        ps.put("hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect");
        ps.put("hibernate.hbm2ddl.auto", "none");
        ps.put("hibernate.connection.characterEncoding", "UTF-8");
        ps.put("hibernate.connection.charSet", "UTF-8");
        ps.put(AvailableSettings.FORMAT_SQL, "true");
        ps.put(AvailableSettings.DEFAULT_SCHEMA, "malina");
        ps.put(AvailableSettings.SHOW_SQL, "true");
        return ps;

    }
}
