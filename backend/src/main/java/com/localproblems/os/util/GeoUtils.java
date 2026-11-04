package com.localproblems.os.util;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import java.math.BigDecimal;

public class GeoUtils {
    
    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    
    /**
     * Create PostGIS Point from latitude and longitude
     */
    public static Point createPoint(Double latitude, Double longitude) {
        return geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }
    
    public static Point createPoint(BigDecimal latitude, BigDecimal longitude) {
        return createPoint(latitude.doubleValue(), longitude.doubleValue());
    }
    
    /**
     * Calculate distance between two points using Haversine formula
     * Returns distance in meters
     */
    public static double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final double R = 6371000; // Earth radius in meters
        
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
    
    public static double calculateDistance(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
        return calculateDistance(lat1.doubleValue(), lon1.doubleValue(), lat2.doubleValue(), lon2.doubleValue());
    }
}
